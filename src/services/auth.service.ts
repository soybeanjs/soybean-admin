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
import { roleService } from './role.service';

/**
 * 认证服务（P1-04/P1-05，v3 §6.3/§6.4，unify auth.service 范式）。
 *
 * JWT 双 token（hono/jwt HS256）+ 黑名单（useKV，dev 内存 / prod 可换 Redis driver）：
 * - 登出: access token 拉黑 1h（覆盖剩余有效期），refreshToken 拉黑 7d；
 * - 刷新: 旧 refreshToken 立即拉黑防重放，签发新 token 对。
 */

export type UserRow = typeof user.$inferSelect;
export type LoginResult = { token: string; refreshToken: string; user: AuthUserDTO };

export const BLACKLIST_TOKEN_TTL = 60 * 60; // 1h
export const BLACKLIST_REFRESH_TTL = 60 * 60 * 24 * 7; // 7d

/** 摘除 password 后的 AuthUserDTO（unify createUser 范式）；roles 由调用方按需附加 */
export function toAuthUserDTO(row: UserRow, roles: string[] = []): AuthUserDTO {
  const { password: _password, ...rest } = row;
  void _password;

  return { ...rest, roles };
}

/** 带角色码的用户安全视图（RBAC 依赖 roles，登录/user-info/refresh 全链路一致） */
export async function toAuthUserWithRoles(row: UserRow): Promise<AuthUserDTO> {
  const roles = roleService.getRolesByUserId(row.id).map(role => role.code);

  return toAuthUserDTO(row, roles);
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
  async login(username: string, passwordValue: string): Promise<LoginResult> {
    try {
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

  async register(username: string, passwordValue: string): Promise<LoginResult> {
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
        email: null,
        fullName: username,
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
