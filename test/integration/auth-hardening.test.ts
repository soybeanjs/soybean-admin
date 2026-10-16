/** 覆盖两件在单测里测不到、只能端到端验证的事： 详见 docs/v3-notes.md N-405。 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { api, okData } from '../shared/api-client';

const runId = Date.now().toString(36);

let adminToken = '';
let userToken = '';
let userId = '';
let roleId = '';
let permissionId = '';

/** 本运行真正创建的资源（复用到的既有行不删） */
const created: { userIds: string[]; roleIds: string[]; permissionIds: string[] } = {
  userIds: [],
  roleIds: [],
  permissionIds: []
};

/** 探测端点：真实存在、带参数，且不在 user 角色的默认授权里 */
const PROBE_PATH = '/api/user/:id';
const PROBE_CODE = 'api:get:(/user/[id])';

type ApiRow = { id: string; path: string; method: string };
type PermissionRow = { id: string; code: string };

beforeAll(async () => {
  adminToken = okData<{ token: string }>(
    (await api<{ token: string }>('POST', '/api/auth/login', { body: { userName: 'admin', password: '123456' } })).body
  ).token;

  // 1. 接口登记：先查 `/user/:id` 是否已登记，没有才建（全局唯一码，跨运行会撞）
  const apiRows = okData<ApiRow[]>((await api<ApiRow[]>('GET', '/api/api/all', { token: adminToken })).body);
  const existingApi = apiRows.find(row => row.path === PROBE_PATH && row.method.toLowerCase() === 'get');

  const apiId =
    existingApi?.id ??
    okData<{ id: string }>(
      (
        await api<{ id: string }>('POST', '/api/api', {
          token: adminToken,
          body: { name: `鉴权加固探测接口 ${runId}`, path: PROBE_PATH, method: 'get' }
        })
      ).body
    ).id;

  // 2. 权限点（同样先查后建）
  const permRows = okData<PermissionRow[]>(
    (await api<PermissionRow[]>('GET', '/api/permission/all', { token: adminToken })).body
  );
  let perm = permRows.find(row => row.code === PROBE_CODE);

  if (!perm) {
    perm = okData<PermissionRow>(
      (
        await api<PermissionRow>('POST', '/api/permission', {
          token: adminToken,
          body: { resourceType: 'api', resourceId: apiId }
        })
      ).body
    );
    created.permissionIds.push(perm.id);
  }

  permissionId = perm.id;
  expect(perm.code).toBe(PROBE_CODE);

  // 3. 角色（初始不给权限）
  roleId = okData<{ id: string }>(
    (
      await api<{ id: string }>('POST', '/api/role', {
        token: adminToken,
        body: { name: `鉴权加固角色 ${runId}`, code: `it_hardening_${runId}` }
      })
    ).body
  ).id;
  created.roleIds.push(roleId);

  // 4. 用户 + 登录
  const userName = `it_hardening_${runId}`;

  userId = okData<{ id: string }>(
    (
      await api<{ id: string }>('POST', '/api/user', {
        token: adminToken,
        body: { username: userName, password: '123456', roleIds: [roleId] }
      })
    ).body
  ).id;
  created.userIds.push(userId);

  userToken = okData<{ token: string }>(
    (await api<{ token: string }>('POST', '/api/auth/login', { body: { userName, password: '123456' } })).body
  ).token;
});

afterAll(async () => {
  const batches: Array<[string, string[]]> = [
    ['/api/user/batch-delete', created.userIds],
    ['/api/role/batch-delete', created.roleIds],
    ['/api/permission/batch-delete', created.permissionIds]
  ];

  for (const [path, ids] of batches) {
    if (ids.length) await api('POST', path, { token: adminToken, body: { ids } });
  }
});

/** 探测请求：任何非 4003 都说明「过了鉴权」（资源不存在时 handler 返回 4000） */
async function probe(): Promise<string> {
  const { body } = await api('GET', `/api/user/probe-${runId}`, { token: userToken });

  return body.code;
}

describe('鉴权加固：enabled 过滤 + 权限缓存失效（§5.1 / §5.2）', () => {
  it('初始：角色未获权限 → 4003', async () => {
    expect(await probe()).toBe('4003');
  });

  it('授权后同一 token 立刻放行（缓存失效即时生效，不等 TTL）', async () => {
    const grant = await api('PUT', `/api/role/${roleId}/permissions`, {
      token: adminToken,
      body: { permissionIds: [permissionId] }
    });

    expect(grant.body.code).toBe('0000');
    expect(await probe()).not.toBe('4003');
  });

  it('停用权限点 → 立刻 4003（权限点 enabled 过滤）', async () => {
    const disable = await api('PUT', `/api/permission/${permissionId}`, {
      token: adminToken,
      body: { enabled: 'N' }
    });

    expect(disable.body.code).toBe('0000');
    expect(await probe()).toBe('4003');
  });

  it('重新启用权限点 → 立刻放行', async () => {
    const enable = await api('PUT', `/api/permission/${permissionId}`, {
      token: adminToken,
      body: { enabled: 'Y' }
    });

    expect(enable.body.code).toBe('0000');
    expect(await probe()).not.toBe('4003');
  });

  it('停用角色 → 立刻 4003（角色 enabled 过滤，§5.1 主线）', async () => {
    const disable = await api('PUT', `/api/role/${roleId}`, {
      token: adminToken,
      body: { enabled: 'N' }
    });

    expect(disable.body.code).toBe('0000');
    expect(await probe()).toBe('4003');
  });

  it('停用的角色不再出现在 role/user 视图（/api/auth/user-info 同步收窄）', async () => {
    const info = okData<{ roles: string[] }>(
      (await api<{ roles: string[] }>('GET', '/api/auth/user-info', { token: userToken })).body
    );

    expect(info.roles).not.toContain(`it_hardening_${runId}`);
  });

  it('重新启用角色 → 立刻放行', async () => {
    const enable = await api('PUT', `/api/role/${roleId}`, {
      token: adminToken,
      body: { enabled: 'Y' }
    });

    expect(enable.body.code).toBe('0000');
    expect(await probe()).not.toBe('4003');
  });

  it('移除用户角色 → 立刻 4003（用户-角色变更失效缓存）', async () => {
    const revoke = await api('PUT', `/api/user/${userId}/roles`, {
      token: adminToken,
      body: { roleIds: [] }
    });

    expect(revoke.body.code).toBe('0000');
    expect(await probe()).toBe('4003');
  });

  it('重新授予角色 → 立刻放行（正向失效也覆盖，避免只测了「变严」）', async () => {
    const grant = await api('PUT', `/api/user/${userId}/roles`, {
      token: adminToken,
      body: { roleIds: [roleId] }
    });

    expect(grant.body.code).toBe('0000');
    expect(await probe()).not.toBe('4003');
  });
});
