import { useKV } from 'ubean/server';

/** 用户权限码缓存（§5.2 鉴权热路径优化） 详见 docs/v3-notes.md N-160。 */

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

/** 读缓存，未命中则 `loader` 回源并写回 详见 docs/v3-notes.md N-161。 */
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

/** 清空整个权限码命名空间 详见 docs/v3-notes.md N-162。 */
export async function invalidateAllPermissionCache(): Promise<void> {
  await permissionStore().clear();
}
