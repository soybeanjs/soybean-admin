import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useKV } from 'ubean/server';
import {
  PERMISSION_CACHE_NAMESPACE,
  getCachedPermissionCodes,
  invalidateAllPermissionCache,
  invalidateUserPermissionCache,
  invalidateUserPermissionCacheMany,
  userPermissionCacheKey
} from '@/shared/permission-cache';

/** 注意 `useKV` 的命名空间是模块级单例（同名只按首次调用初始化，options 被忽略）， 详见 docs/v3-notes.md N-426。 */
describe('permission-cache', () => {
  beforeEach(async () => {
    await invalidateAllPermissionCache();
  });

  it('未命中时回源一次并写回缓存', async () => {
    const loader = vi.fn(() => ['api:get:(/user/list)']);

    const first = await getCachedPermissionCodes('u1', loader);
    expect(first).toEqual(['api:get:(/user/list)']);
    expect(loader).toHaveBeenCalledTimes(1);

    // 第二次命中缓存，不再回源
    const second = await getCachedPermissionCodes('u1', loader);
    expect(second).toEqual(['api:get:(/user/list)']);
    expect(loader).toHaveBeenCalledTimes(1);
  });

  it('不同用户各缓存一份，互不干扰', async () => {
    const loaderA = vi.fn(() => ['a']);
    const loaderB = vi.fn(() => ['b']);

    expect(await getCachedPermissionCodes('u1', loaderA)).toEqual(['a']);
    expect(await getCachedPermissionCodes('u2', loaderB)).toEqual(['b']);
    expect(await getCachedPermissionCodes('u1', loaderA)).toEqual(['a']);

    expect(loaderA).toHaveBeenCalledTimes(1);
    expect(loaderB).toHaveBeenCalledTimes(1);
  });

  it('缓存空数组（无任何角色/权限的用户）也算命中', async () => {
    const loader = vi.fn(() => []);

    expect(await getCachedPermissionCodes('u-empty', loader)).toEqual([]);
    expect(await getCachedPermissionCodes('u-empty', loader)).toEqual([]);
    // 空数组是有效结果，不能被当成 miss 反复回源
    expect(loader).toHaveBeenCalledTimes(1);
  });

  it('invalidateUserPermissionCache 后下次必然回源', async () => {
    const loader = vi.fn(() => ['x']);

    await getCachedPermissionCodes('u3', loader);
    expect(loader).toHaveBeenCalledTimes(1);

    await invalidateUserPermissionCache('u3');

    await getCachedPermissionCodes('u3', loader);
    expect(loader).toHaveBeenCalledTimes(2);
  });

  it('invalidateUserPermissionCacheMany 批量失效（含去重）', async () => {
    const loader = vi.fn(() => ['x']);

    await getCachedPermissionCodes('u4', loader);
    await getCachedPermissionCodes('u5', loader);
    expect(loader).toHaveBeenCalledTimes(2);

    await invalidateUserPermissionCacheMany(['u4', 'u4', 'u5']);

    await getCachedPermissionCodes('u4', loader);
    await getCachedPermissionCodes('u5', loader);
    expect(loader).toHaveBeenCalledTimes(4);
  });

  it('批量失效传空数组时不报错也不动缓存', async () => {
    const loader = vi.fn(() => ['x']);

    await getCachedPermissionCodes('u6', loader);
    await invalidateUserPermissionCacheMany([]);

    await getCachedPermissionCodes('u6', loader);
    expect(loader).toHaveBeenCalledTimes(1);
  });

  it('invalidateAllPermissionCache 清空所有用户', async () => {
    const loader = vi.fn(() => ['x']);

    await getCachedPermissionCodes('u7', loader);
    await getCachedPermissionCodes('u8', loader);
    expect(loader).toHaveBeenCalledTimes(2);

    await invalidateAllPermissionCache();

    await getCachedPermissionCodes('u7', loader);
    await getCachedPermissionCodes('u8', loader);
    expect(loader).toHaveBeenCalledTimes(4);
  });

  it('缓存写进独立命名空间，不与其它 KV 命名空间冲突', async () => {
    await getCachedPermissionCodes('u9', () => ['perm-code']);

    const other = useKV<string[]>('some-other-namespace', { prefix: 'perm:user:' });
    expect(await other.get(userPermissionCacheKey('u9'))).toBeNull();

    const own = useKV<string[]>(PERMISSION_CACHE_NAMESPACE, { prefix: 'perm:user:' });
    expect(await own.get(userPermissionCacheKey('u9'))).toEqual(['perm-code']);
  });

  it('失效只清本用户的键（不误伤他人）', async () => {
    const loader = vi.fn(() => ['x']);

    await getCachedPermissionCodes('u10', loader);
    await getCachedPermissionCodes('u11', loader);

    await invalidateUserPermissionCache('u10');

    // u11 仍命中缓存
    await getCachedPermissionCodes('u11', loader);
    expect(loader).toHaveBeenCalledTimes(2);

    // u10 必须回源
    await getCachedPermissionCodes('u10', loader);
    expect(loader).toHaveBeenCalledTimes(3);
  });

  it('回源抛错时异常向上冒泡，不写半截缓存', async () => {
    const broken = vi.fn(() => {
      throw new Error('boom');
    });

    await expect(getCachedPermissionCodes('u12', broken)).rejects.toThrow('boom');

    // 下一次仍然回源（坏结果没被缓存）
    const ok = vi.fn(() => ['ok']);
    expect(await getCachedPermissionCodes('u12', ok)).toEqual(['ok']);
    expect(ok).toHaveBeenCalledTimes(1);
  });
});
