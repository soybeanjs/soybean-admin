import { useKV } from 'ubean/server';

/**
 * 用户权限码缓存（§5.2 鉴权热路径优化）。
 *
 * **为什么需要**：RBAC 中间件对每个已登录请求都要判定权限码。改造前
 * `checkUserHasPermission` 每次三查（permission → user_role → role_permission），
 * 而 JWT 里不带权限码，等于每个请求都打三遍库。这里把「用户 → 权限码集合」
 * 缓存进 `useKV`（dev 内存 driver，prod 可换 Redis driver），热路径退化为一次
 * KV 读。
 *
 * **失效策略**：写操作显式失效 + TTL 兜底（二者缺一不可）。
 * - 显式失效覆盖正常路径：角色/权限/用户-角色/组织-角色 变更后立刻清对应键；
 * - TTL 是兜底网：漏掉的失效路径最多脏 `PERMISSION_CACHE_TTL` 秒。
 *
 * 本模块**不 import 任何 db / service**（纯 KV 逻辑，loader 由调用方注入），
 * 避免 `shared → services → db` 的反向依赖；反向查用户、失效编排在
 * `permission.service` / `role.service` 里做。
 */

/** 缓存 TTL（秒）。5 分钟：足够覆盖正常写路径的显式失效，又限制漏失效的脏读窗口 */
export const PERMISSION_CACHE_TTL = 300;

/** KV 命名空间（与 captcha / token-blacklist 同层，独立命名避免键冲突） */
export const PERMISSION_CACHE_NAMESPACE = 'permission';

/** 缓存值：权限码字符串数组（去重后） */
export type CachedPermissionCodes = string[];

function permissionStore() {
  return useKV<CachedPermissionCodes>(PERMISSION_CACHE_NAMESPACE, { prefix: 'perm:user:' });
}

/** 缓存键（KVNamespace 会再拼一次 prefix，这里只给键名部分，测试与失效共用） */
export function userPermissionCacheKey(userId: string): string {
  return userId;
}

/**
 * 读缓存，未命中则 `loader` 回源并写回。
 *
 * `loader` 是同步的（drizzle better-sqlite3 同步 API），回源失败时异常向上抛，
 * 不写半截缓存。
 */
export async function getCachedPermissionCodes(
  userId: string,
  loader: () => CachedPermissionCodes
): Promise<CachedPermissionCodes> {
  const store = permissionStore();
  const cached = await store.get(userPermissionCacheKey(userId));

  if (cached !== null) {
    return cached;
  }

  const codes = loader();
  await store.set(userPermissionCacheKey(userId), codes, PERMISSION_CACHE_TTL);

  return codes;
}

/** 失效单个用户的权限码缓存 */
export async function invalidateUserPermissionCache(userId: string): Promise<void> {
  await permissionStore().remove(userPermissionCacheKey(userId));
}

/** 批量失效（角色/组织变更 → 受影响用户集合） */
export async function invalidateUserPermissionCacheMany(userIds: readonly string[]): Promise<void> {
  const unique = [...new Set(userIds)];

  if (!unique.length) return;

  await Promise.all(unique.map(userId => invalidateUserPermissionCache(userId)));
}

/**
 * 清空整个权限码命名空间。
 *
 * 权限点自身变更（改 code / 删除）无法廉价反查到用户集合，直接全清 ——
 * 权限点是低频管理操作，全清比逐个反查更简单也更不容易漏。
 */
export async function invalidateAllPermissionCache(): Promise<void> {
  await permissionStore().clear();
}
