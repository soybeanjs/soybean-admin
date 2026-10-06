import { useKV } from 'ubean/server';
import { hash, compare, genSalt } from 'bcryptjs';
import { decode, sign, verify } from 'hono/jwt';
import { serverEnv } from '@/env.server';
import type { AuthUserDTO } from '@/schema/auth';

/**
 * 认证工具层（v3 §6.4，unify 自研 JWT 首版）：
 * - 签发/校验用 hono/jwt（HS256），密码哈希用 bcryptjs；
 * - 令牌黑名单走 `useKV`（dev 内存 driver，演进 v3.1+ 换 Redis driver），键 `blacklist:${token}`。
 */

/** JWT payload（与 unify 对齐：最小化，只带 id + username；jti 保证同一秒内签发的令牌串不重复，避免黑名单误伤同秒并发登录） */
export type JwtPayload = Pick<AuthUserDTO, 'id' | 'username'> & {
  exp?: number;
  jti?: string;
};

/** 过期时间串转秒（'1d' / '12h' / '30m' / '3600s' / 纯数字秒） */
export function resolveExpiresInSeconds(expiresIn: string, fallbackSeconds: number): number {
  const match = /^(\d+)([smhd]?)$/.exec(expiresIn.trim());

  if (!match) {
    return fallbackSeconds;
  }

  const value = Number(match[1]);
  const unit = match[2];

  const multipliers: Record<string, number> = {
    '': 1,
    s: 1,
    m: 60,
    h: 3600,
    d: 86_400
  };

  return value * (multipliers[unit] ?? 1);
}

/** 生成访问令牌 */
export async function generateToken(user: AuthUserDTO): Promise<string> {
  const payload: JwtPayload = {
    id: user.id,
    username: user.username,
    exp: Math.floor(Date.now() / 1000) + resolveExpiresInSeconds(serverEnv.JWT_EXPIRES_IN, 86_400),
    jti: crypto.randomUUID()
  };

  return sign(payload, serverEnv.JWT_SECRET, 'HS256');
}

/** 生成刷新令牌（结构与访问令牌一致，有效期独立配置） */
export async function generateRefreshToken(user: AuthUserDTO): Promise<string> {
  const payload: JwtPayload = {
    id: user.id,
    username: user.username,
    exp: Math.floor(Date.now() / 1000) + resolveExpiresInSeconds(serverEnv.REFRESH_TOKEN_EXPIRES_IN, 604_800),
    jti: crypto.randomUUID()
  };

  return sign(payload, serverEnv.JWT_SECRET, 'HS256');
}

/** 验证 JWT 令牌（签名 + 过期），失败返回 null */
export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const payload = await verify(token, serverEnv.JWT_SECRET, 'HS256');

    if (!isJwtPayload(payload)) {
      return null;
    }

    return { id: payload.id, username: payload.username, exp: payload.exp };
  } catch {
    return null;
  }
}

/** JWT payload 形状守卫（honno/jwt 返回 JWTPayload 基类，字段需运行时收窄） */
function isJwtPayload(value: unknown): value is JwtPayload {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof value.id === 'string' &&
    'username' in value &&
    typeof value.username === 'string'
  );
}

/** 解码令牌（不验签），用于登出等场景提取 payload */
export function decodeToken(token: string): JwtPayload | null {
  try {
    const decoded = decode(token);
    const payload: unknown = decoded.payload;

    if (!isJwtPayload(payload)) {
      return null;
    }

    return { id: payload.id, username: payload.username, exp: payload.exp };
  } catch {
    return null;
  }
}

/** 哈希密码（bcrypt, cost 10） */
export async function hashPassword(password: string): Promise<string> {
  const salt = await genSalt(10);

  return hash(password, salt);
}

/** 校验密码 */
export function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword);
}

function blacklistStore() {
  return useKV<string>('token-blacklist', { prefix: 'blacklist:' });
}

/** 将令牌加入黑名单（ttl 秒；建议覆盖令牌剩余有效期） */
export async function addTokenToBlacklist(token: string, ttlSeconds: number): Promise<void> {
  await blacklistStore().set(token, '1', ttlSeconds);
}

/** 令牌是否已被拉黑 */
export async function isTokenBlacklisted(token: string): Promise<boolean> {
  const value = await blacklistStore().get(token);

  return value !== null;
}
