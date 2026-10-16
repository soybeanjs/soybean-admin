import { useKV } from 'ubean/server';
import { eq } from 'drizzle-orm';
import {
  addTokenToBlacklist,
  comparePassword,
  decodeToken,
  generateRefreshToken,
  generateToken,
  hashPassword,
  isTokenBlacklisted,
  verifyToken
} from '@/shared/auth';
import type { JwtPayload } from '@/shared/auth';
import { AppError } from '@/shared/error';
import { serverEnv } from '@/env.server';
import type { AuthUserDTO } from '@/schema/auth';
import { appDb } from '../db';
import { user } from '../db/schema';
import { verifyCaptcha } from './captcha.service';
import { permissionService } from './permission.service';
import { roleService } from './role.service';

/** JWT 双 token（hono/jwt HS256）+ 黑名单（useKV，dev 内存 / prod 可换 Redis driver）： 详见 docs/v3-notes.md N-245。 */

export type UserRow = typeof user.$inferSelect;
export type LoginResult = { token: string; refreshToken: string; user: AuthUserDTO };

export const BLACKLIST_TOKEN_TTL = 60 * 60; // 1h
export const BLACKLIST_REFRESH_TTL = 60 * 60 * 24 * 7; // 7d

/** 微信二维码 ticket 有效期（秒） */
export const WECHAT_TICKET_TTL = 300;

/** 事实上的「扫码后」微信昵称（无真实开放平台凭证，按 userId 派生稳定假名） */
function mockWechatNickname(userId: string): string {
  return `wechat_${userId.slice(0, 8)}`;
}

function wechatTicketStore() {
  return useKV<string>('wechat-ticket', { prefix: 'wechat-ticket:' });
}

function wechatBindingStore() {
  return useKV<string>('wechat-binding', { prefix: 'wechat-binding:' });
}

/** 摘除 password 后的 AuthUserDTO（unify createUser 范式）；roles/buttons 由调用方按需附加 */
export function toAuthUserDTO(row: UserRow, roles: string[] = [], buttons: string[] = []): AuthUserDTO {
  const { password: _password, ...rest } = row;
  void _password;

  return { ...rest, roles, buttons };
}

/** 带角色码 + 按钮权限码的用户安全视图 详见 docs/v3-notes.md N-246。 */
export async function toAuthUserWithRoles(row: UserRow): Promise<AuthUserDTO> {
  const roles = roleService.getRolesByUserId(row.id).map(role => role.code);
  const buttons = await permissionService.getUserPermissionCodes(row.id);

  return toAuthUserDTO(row, roles, buttons);
}

export function findUserByUsername(username: string): UserRow | undefined {
  const [row] = appDb.select().from(user).where(eq(user.username, username)).all();

  return row;
}

export function findUserById(id: string): UserRow | undefined {
  const [row] = appDb.select().from(user).where(eq(user.id, id)).all();

  return row;
}

function assertUserUsable(row: UserRow): void {
  if (row.enabled !== 'Y') {
    throw new AppError('USER_DISABLED', '用户已被禁用');
  }
}

export const authService = {
  /** 密码登录（`grantType: 'pwd'`） 详见 docs/v3-notes.md N-247。 */
  async login(
    username: string,
    passwordValue: string,
    captcha?: { captchaId: string; captchaCode: string }
  ): Promise<LoginResult> {
    try {
      if (captcha?.captchaId && captcha.captchaCode) {
        await verifyCaptcha(captcha.captchaId, captcha.captchaCode);
      }

      const row = findUserByUsername(username);
      if (!row || !(await comparePassword(passwordValue, row.password))) {
        throw new AppError('PASSWORD_INVALID', '用户名或密码错误');
      }
      assertUserUsable(row);

      const authUser = await toAuthUserWithRoles(row);

      return {
        token: await generateToken(authUser),
        refreshToken: await generateRefreshToken(authUser),
        user: authUser
      };
    } catch (error) {
      throw AppError.from(error, 'SYSTEM_ERROR', '登录失败');
    }
  },

  /** 验证码登录（`grantType: 'captcha'`） 详见 docs/v3-notes.md N-248。 */
  async loginByCaptcha(username: string, captchaId: string, captchaCode: string): Promise<LoginResult> {
    try {
      await verifyCaptcha(captchaId, captchaCode);

      const row = findUserByUsername(username);
      if (!row) {
        throw new AppError('USER_NOT_FOUND', '用户不存在');
      }
      assertUserUsable(row);

      const authUser = await toAuthUserWithRoles(row);

      return {
        token: await generateToken(authUser),
        refreshToken: await generateRefreshToken(authUser),
        user: authUser
      };
    } catch (error) {
      if (error instanceof AppError) throw error;

      throw AppError.from(error, 'SYSTEM_ERROR', '登录失败');
    }
  },

  /** 重置密码（未登录；图形验证码校验通过后直接改密） */
  async resetPassword(username: string, newPassword: string, captchaId: string, captchaCode: string): Promise<void> {
    try {
      await verifyCaptcha(captchaId, captchaCode);

      const row = findUserByUsername(username);
      if (!row) {
        throw new AppError('USER_NOT_FOUND', '用户不存在');
      }

      appDb
        .update(user)
        .set({
          password: await hashPassword(newPassword),
          updatedBy: row.username,
          updatedTime: new Date().toISOString()
        })
        .where(eq(user.id, row.id))
        .run();
    } catch (error) {
      if (error instanceof AppError) throw error;

      throw AppError.from(error, 'DATABASE_ERROR', '重置密码失败');
    }
  },

  /** 生成微信绑定二维码（mock） 详见 docs/v3-notes.md N-249。 */
  async createWechatQrcode(): Promise<{ ticket: string; url: string; expiresIn: number }> {
    const ticket = crypto.randomUUID();

    await wechatTicketStore().set(ticket, 'pending', WECHAT_TICKET_TTL);

    return {
      ticket,
      url: `https://open.weixin.qq.com/connect/qrconnect?appid=demo_appid&scope=snsapi_login&state=${ticket}`,
      expiresIn: WECHAT_TICKET_TTL
    };
  },

  /** 完成微信绑定（mock：ticket 有效即视为扫码成功）；返回派生昵称 */
  async bindWechat(userId: string, ticket: string): Promise<{ bound: boolean; nickname: string }> {
    const pending = await wechatTicketStore().get(ticket);

    if (pending !== 'pending') {
      throw new AppError('RESOURCE_EXPIRED', '二维码已失效，请刷新后重试');
    }

    await wechatTicketStore().remove(ticket);

    const nickname = mockWechatNickname(userId);
    await wechatBindingStore().set(userId, nickname);

    return { bound: true, nickname };
  },

  /** 查询某用户的微信绑定状态 */
  async getWechatBinding(userId: string): Promise<{ bound: boolean; nickname: string | null }> {
    const nickname = await wechatBindingStore().get(userId);

    return { bound: nickname !== null, nickname };
  },

  async register(
    username: string,
    passwordValue: string,
    extra: { email?: string; fullName?: string } = {}
  ): Promise<LoginResult> {
    try {
      if (findUserByUsername(username)) {
        throw new AppError('USERNAME_EXISTS', '用户名已存在');
      }

      const now = new Date().toISOString();
      const newRow: UserRow = {
        id: crypto.randomUUID(),
        username,
        password: await hashPassword(passwordValue),
        phone: null,
        email: extra.email ?? null,
        fullName: extra.fullName || username,
        avatar: null,
        description: null,
        homePath: '/home',
        enabled: 'Y',
        createdBy: username,
        createdTime: now,
        updatedBy: username,
        updatedTime: now
      };
      appDb.insert(user).values(newRow).run();

      const authUser = await toAuthUserWithRoles(newRow);

      return {
        token: await generateToken(authUser),
        refreshToken: await generateRefreshToken(authUser),
        user: authUser
      };
    } catch (error) {
      throw AppError.from(error, 'SYSTEM_ERROR', '注册失败');
    }
  },

  /** 获取当前用户信息（token 验签在中间件完成，此处做状态复核） */
  async getUserInfo(userId: string): Promise<AuthUserDTO> {
    try {
      const row = findUserById(userId);
      if (!row) {
        throw new AppError('USER_NOT_FOUND', '用户不存在');
      }
      assertUserUsable(row);

      return toAuthUserWithRoles(row);
    } catch (error) {
      throw AppError.from(error, 'SYSTEM_ERROR', '获取用户信息失败');
    }
  },

  /** 刷新 token 对（验签 + 黑名单 + 用户状态；旧 refreshToken 立即拉黑防重放） */
  async refreshToken(refreshToken: string): Promise<LoginResult> {
    try {
      if (await isTokenBlacklisted(refreshToken)) {
        throw new AppError('REFRESH_TOKEN_BLACKLISTED', '刷新令牌已失效');
      }

      const payload = await verifyToken(refreshToken);
      if (!payload) {
        throw new AppError('REFRESH_TOKEN_INVALID', '刷新令牌无效或已过期');
      }

      const row = findUserById(payload.id);
      if (!row) {
        throw new AppError('USER_NOT_FOUND', '用户不存在');
      }
      assertUserUsable(row);

      await addTokenToBlacklist(refreshToken, BLACKLIST_REFRESH_TTL);
      const authUser = await toAuthUserWithRoles(row);

      return {
        token: await generateToken(authUser),
        refreshToken: await generateRefreshToken(authUser),
        user: authUser
      };
    } catch (error) {
      if (error instanceof AppError) throw error;

      throw new AppError('REFRESH_TOKEN_INVALID', '刷新令牌无效或已过期');
    }
  },

  /** 登出: access token 拉黑 1h + refreshToken 拉黑 7d */
  async logout(token: string, refreshToken?: string): Promise<void> {
    try {
      await addTokenToBlacklist(token, BLACKLIST_TOKEN_TTL);
      if (refreshToken) {
        await addTokenToBlacklist(refreshToken, BLACKLIST_REFRESH_TTL);
      }
    } catch (error) {
      throw AppError.from(error, 'CACHE_ERROR', '登出失败');
    }
  },

  /** 验证 access token（验签+过期+黑名单），有效返回 payload，否则 null */
  async verifyAccessToken(token: string): Promise<JwtPayload | null> {
    const payload = await verifyToken(token);

    if (!payload || (await isTokenBlacklisted(token))) {
      return null;
    }

    return payload;
  },

  /** 从令牌解出用户 id（不验签，仅登出/日志场景用） */
  decodeUserId(token: string): string | null {
    const payload = decodeToken(token);

    return payload?.id ?? null;
  }
};

// 环境默认值引用（供测试断言过期配置生效）
export const JWT_EXPIRES_IN = serverEnv.JWT_EXPIRES_IN;
