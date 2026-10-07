/**
 * API 集成测试（P1-10，v3 §6.1/§6.3）。
 *
 * 前置：dev server 就绪（global-setup.ts 自起或复用 9527）。
 * 覆盖：健康检查、认证全链路（login/register/refresh/logout/user-info/modify-password）、
 * 图形验证码与验证码登录、重置密码、微信绑定（mock）、
 * RBAC（super 放行、普通用户按权限码）、8 套 CRUD 生命周期、分页/校验/错误归一。
 * 全部断言业务码 `{ code, message, data }` 结构。
 */
import { readFileSync } from 'node:fs';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const BASE_URL = readFileSync(new URL('./baseUrl.txt', import.meta.url), 'utf-8').trim();

type ApiEnvelope<T = unknown> = { code: string; message: string; data: T };

let adminToken = '';
let userToken = '';

async function api<T = unknown>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  path: string,
  options: { body?: unknown; token?: string; query?: Record<string, string> } = {}
): Promise<{ status: number; body: ApiEnvelope<T> }> {
  const url = new URL(path, BASE_URL);

  for (const [key, value] of Object.entries(options.query ?? {})) {
    url.searchParams.set(key, value);
  }

  const res = await fetch(url, {
    method,
    headers: {
      ...(options.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {})
    },
    // GET 不允许携带 body（unicorn/no-invalid-fetch-options），条件展开规避 undefined 字段
    ...(options.body !== undefined ? { body: JSON.stringify(options.body) } : {})
  });
  // 所有端点经响应包装中间件输出统一信封，这里直接按信封类型收（fetch json 返回 any，赋值即合法）
  const body: ApiEnvelope<T> = await res.json();

  return { status: res.status, body };
}

/** 断言业务成功（code === '0000'）并取出 data */
function okData<T>(body: ApiEnvelope<T>): T {
  expect(body.code).toBe('0000');

  return body.data;
}

type CreatedIds = { userIds: string[]; roleIds: string[]; menuIds: string[] };

const createdIds: CreatedIds = { userIds: [], roleIds: [], menuIds: [] };

/** 每次运行唯一的后缀（避免跨次运行残留数据造成重复冲突） */
const runId = Date.now().toString(36);

async function cleanup() {
  const batches: Array<[string, string[]]> = [
    ['/api/user/batch-delete', createdIds.userIds],
    ['/api/role/batch-delete', createdIds.roleIds],
    ['/api/menu/batch-delete', createdIds.menuIds]
  ];

  for (const [path, ids] of batches) {
    if (ids.length) {
      await api('POST', path, { token: adminToken, body: { ids } });
    }
  }
}

beforeAll(async () => {
  const login = await api<{ token: string }>('POST', '/api/auth/login', {
    body: { userName: 'admin', password: '123456' }
  });

  adminToken = okData<{ token: string }>(login.body).token;

  const userLogin = await api<{ token: string }>('POST', '/api/auth/login', {
    body: { userName: 'user', password: '123456' }
  });

  userToken = okData<{ token: string }>(userLogin.body).token;
});

afterAll(async () => {
  await cleanup();
});

// ---------- 健康检查 ----------

describe('GET /api/system/health', () => {
  it('公开可访问且返回 0000 包装', async () => {
    const { status, body } = await api<{ status: string; version: string; timestamp: number }>(
      'GET',
      '/api/system/health'
    );
    const data = okData(body);

    expect(status).toBe(200);
    expect(data.status).toBe('ok');
    expect(data.version).toBeTruthy();
  });
});

// ---------- 认证 ----------

describe('POST /api/auth/login', () => {
  it('错误密码返回业务码 2009', async () => {
    const { body } = await api('POST', '/api/auth/login', { body: { userName: 'admin', password: 'wrong' } });

    expect(body.code).toBe('2009');
  });

  it('参数缺失返回业务码 3000', async () => {
    const { body } = await api('POST', '/api/auth/login', { body: { userName: '' } });

    expect(body.code).toBe('3000');
  });

  it('admin 登录返回 token 对与用户视图', async () => {
    const data = okData(
      (
        await api<{ token: string; refreshToken: string; user: { username: string; roles: string[] } }>(
          'POST',
          '/api/auth/login',
          {
            body: { userName: 'admin', password: '123456' }
          }
        )
      ).body
    );

    expect(data.token).toBeTruthy();
    expect(data.refreshToken).toBeTruthy();
    expect(data.user.username).toBe('admin');
    expect(data.user.roles).toContain('super');
  });

  it('普通用户登录成功', async () => {
    const { body } = await api<{ token: string }>('POST', '/api/auth/login', {
      body: { userName: 'user', password: '123456' }
    });

    expect(okData<{ token: string }>(body).token).toBeTruthy();
  });
});

describe('GET /api/auth/user-info', () => {
  it('无 token 返回业务码 2000', async () => {
    const { body } = await api('GET', '/api/auth/user-info');

    expect(body.code).toBe('2000');
  });

  it('伪造 token 返回业务码 2000', async () => {
    const { body } = await api('GET', '/api/auth/user-info', { token: 'fake-token' });

    expect(body.code).toBe('2000');
  });

  it('有效 token 返回用户视图（无密码字段、含角色）', async () => {
    const data = okData(
      (
        await api<{ id: string; username: string; roles: string[]; password?: string }>('GET', '/api/auth/user-info', {
          token: adminToken
        })
      ).body
    );

    expect(data.id).toBe('U_admin');
    expect(data.roles).toContain('super');
    expect(data.password).toBeUndefined();
  });
});

describe('POST /api/auth/refresh-token', () => {
  it('可换取新 token 对且旧 refreshToken 失效', async () => {
    const login = okData<{ refreshToken: string }>(
      (
        await api<{ refreshToken: string }>('POST', '/api/auth/login', {
          body: { userName: 'user', password: '123456' }
        })
      ).body
    );

    const first = await api<{ token: string; refreshToken: string }>('POST', '/api/auth/refresh-token', {
      body: { refreshToken: login.refreshToken }
    });
    const refreshed = okData(first.body);

    expect(refreshed.token).toBeTruthy();

    // 旧 refreshToken 已拉黑（防重放）
    const replay = await api('POST', '/api/auth/refresh-token', { body: { refreshToken: login.refreshToken } });

    expect(replay.body.code).not.toBe('0000');
  });

  it('无效 refreshToken 返回非 0000 业务码', async () => {
    const { body } = await api('POST', '/api/auth/refresh-token', { body: { refreshToken: 'invalid' } });

    expect(body.code).not.toBe('0000');
  });
});

describe('POST /api/auth/logout', () => {
  it('登出后原 token 立即失效', async () => {
    const login = okData<{ token: string }>(
      (
        await api<{ token: string }>('POST', '/api/auth/login', {
          body: { userName: 'user', password: '123456' }
        })
      ).body
    );

    const logout = await api('POST', '/api/auth/logout', { token: login.token });

    expect(logout.body.code).toBe('0000');

    const after = await api('GET', '/api/auth/user-info', { token: login.token });

    expect(after.body.code).toBe('2000');
  });
});

describe('POST /api/auth/modify-password', () => {
  it('当前密码错误返回业务错误', async () => {
    const { body } = await api('POST', '/api/auth/modify-password', {
      token: userToken,
      body: { currentPassword: 'bad', newPassword: 'new123456' }
    });

    expect(body.code).not.toBe('0000');
  });

  it('修改成功后新密码可登录', async () => {
    const change = await api('POST', '/api/auth/modify-password', {
      token: userToken,
      body: { currentPassword: '123456', newPassword: '123456' }
    });

    expect(change.body.code).toBe('0000');

    const relogin = await api<{ token: string }>('POST', '/api/auth/login', {
      body: { userName: 'user', password: '123456' }
    });

    expect(okData<{ token: string }>(relogin.body).token).toBeTruthy();
  });
});

describe('POST /api/auth/register + POST /api/auth/error', () => {
  it('注册即登录（返回 token 对），重复注册返回非 0000，清理后删除', async () => {
    const username = `it_${runId}`;
    const reg = await api<{ token: string; user: { username: string } }>('POST', '/api/auth/register', {
      body: { userName: username, password: 'pass123456' }
    });

    const data = okData<{ token: string; user: { username: string } }>(reg.body);

    expect(data.user.username).toBe(username);

    // 用户仍存在时重复注册必须失败
    const dup = await api('POST', '/api/auth/register', { body: { userName: username, password: 'pass123456' } });

    expect(dup.body.code).not.toBe('0000');

    // 清理注册用户（admin 删除）
    const list = await api<{ list: Array<{ id: string; username: string }> }>('GET', '/api/user/list', {
      token: adminToken,
      query: { current: '1', size: '100', username }
    });
    const row = okData<{ list: Array<{ id: string; username: string }> }>(list.body).list.find(
      u => u.username === username
    );

    expect(row).toBeTruthy();

    const del = await api('DELETE', `/api/user/${row?.id}`, { token: adminToken });

    expect(del.body.code).toBe('0000');
  });

  it('演示错误端点输出业务码 1000', async () => {
    const { body } = await api('POST', '/api/auth/error');

    expect(body.code).toBe('1000');
  });
});

// ---------- 图形验证码 / 验证码登录 / 重置密码 / 微信绑定（P2-08） ----------

/** 拉取图形验证码并解出答案（自绘 SVG 的 `<text>` 内容即答案 —— mock 渲染器的事实） */
async function fetchCaptcha(): Promise<{ captchaId: string; code: string }> {
  const data = okData((await api<{ captchaId: string; img: string }>('GET', '/api/auth/captcha')).body);
  const base64 = data.img.split(',')[1] ?? '';
  const svg = Buffer.from(base64, 'base64').toString('utf-8');
  const code = [...svg.matchAll(/<text[^>]*>([^<]+)<\/text>/g)].map(match => match[1] ?? '').join('');

  return { captchaId: data.captchaId, code };
}

describe('GET /api/auth/captcha', () => {
  it('公开返回验证码标识与 SVG data URL', async () => {
    const data = okData((await api<{ captchaId: string; img: string }>('GET', '/api/auth/captcha')).body);

    expect(data.captchaId).toBeTruthy();
    expect(data.img.startsWith('data:image/svg+xml;base64,')).toBe(true);
  });
});

describe('POST /api/auth/login (grantType: captcha)', () => {
  it('验证码正确即登录成功（无需密码）', async () => {
    const { captchaId, code } = await fetchCaptcha();
    const data = okData<{ token: string; user: { username: string } }>(
      (
        await api<{ token: string; user: { username: string } }>('POST', '/api/auth/login', {
          body: { userName: 'user', captchaId, captchaCode: code, grantType: 'captcha' }
        })
      ).body
    );

    expect(data.token).toBeTruthy();
    expect(data.user.username).toBe('user');
  });

  it('验证码错误返回 2012', async () => {
    const { captchaId } = await fetchCaptcha();
    const { body } = await api('POST', '/api/auth/login', {
      body: { userName: 'user', captchaId, captchaCode: 'ZZZZ', grantType: 'captcha' }
    });

    expect(body.code).toBe('2012');
  });

  it('验证码一次性消费：重放返回 2013', async () => {
    const { captchaId, code } = await fetchCaptcha();
    const first = await api('POST', '/api/auth/login', {
      body: { userName: 'user', captchaId, captchaCode: code, grantType: 'captcha' }
    });

    expect(first.body.code).toBe('0000');

    const replay = await api('POST', '/api/auth/login', {
      body: { userName: 'user', captchaId, captchaCode: code, grantType: 'captcha' }
    });

    expect(replay.body.code).toBe('2013');
  });

  it('密码登录可附带验证码校验', async () => {
    const { captchaId, code } = await fetchCaptcha();
    const { body } = await api('POST', '/api/auth/login', {
      body: { userName: 'user', password: '123456', grantType: 'pwd', captchaId, captchaCode: code }
    });

    expect(body.code).toBe('0000');
  });
});

describe('POST /api/auth/reset-password', () => {
  it('重置后新密码可登录（注册用户 → 重置 → 再登录 → 清理）', async () => {
    const username = `rp_${runId}`;
    const reg = await api('POST', '/api/auth/register', {
      body: { userName: username, password: 'pass123456', email: `${username}@test.dev` }
    });

    expect(reg.body.code).toBe('0000');

    const { captchaId, code } = await fetchCaptcha();
    const reset = await api('POST', '/api/auth/reset-password', {
      body: { userName: username, password: 'reset123456', captchaId, captchaCode: code }
    });

    expect(reset.body.code).toBe('0000');

    const relogin = await api('POST', '/api/auth/login', {
      body: { userName: username, password: 'reset123456' }
    });

    expect(relogin.body.code).toBe('0000');

    const list = await api<{ list: Array<{ id: string; username: string }> }>('GET', '/api/user/list', {
      token: adminToken,
      query: { current: '1', size: '100', username }
    });
    const row = okData<{ list: Array<{ id: string; username: string }> }>(list.body).list.find(
      item => item.username === username
    );

    if (row) {
      await api('DELETE', `/api/user/${row.id}`, { token: adminToken });
    }
  });

  it('验证码错误返回 2012', async () => {
    const { captchaId } = await fetchCaptcha();
    const { body } = await api('POST', '/api/auth/reset-password', {
      body: { userName: 'user', password: 'reset123456', captchaId, captchaCode: 'ZZZZ' }
    });

    expect(body.code).toBe('2012');
  });
});

describe('微信绑定（mock）', () => {
  it('二维码公开可得；绑定需登录，绑定后状态可查', async () => {
    const qr = okData<{ ticket: string; url: string }>(
      (await api<{ ticket: string; url: string }>('GET', '/api/auth/wechat-qrcode')).body
    );

    expect(qr.ticket).toBeTruthy();
    expect(qr.url).toContain('qrconnect');

    const unauth = await api('GET', '/api/auth/bind-wechat');

    expect(unauth.body.code).toBe('2000');

    const login = okData<{ token: string }>(
      (
        await api<{ token: string }>('POST', '/api/auth/login', {
          body: { userName: 'user', password: '123456' }
        })
      ).body
    );
    const bound = okData<{ bound: boolean; nickname: string | null }>(
      (
        await api<{ bound: boolean; nickname: string | null }>('POST', '/api/auth/bind-wechat', {
          token: login.token,
          body: { ticket: qr.ticket }
        })
      ).body
    );

    expect(bound.bound).toBe(true);
    expect(bound.nickname).toBeTruthy();

    const status = okData<{ bound: boolean }>(
      (await api<{ bound: boolean }>('GET', '/api/auth/bind-wechat', { token: login.token })).body
    );

    expect(status.bound).toBe(true);
  });

  it('无效 ticket 返回非 0000 业务码', async () => {
    const login = okData<{ token: string }>(
      (
        await api<{ token: string }>('POST', '/api/auth/login', {
          body: { userName: 'user', password: '123456' }
        })
      ).body
    );
    const { body } = await api('POST', '/api/auth/bind-wechat', { token: login.token, body: { ticket: 'invalid' } });

    expect(body.code).not.toBe('0000');
  });
});

// ---------- RBAC ----------

describe('RBAC', () => {
  it('super 访问任意授权端点放行', async () => {
    const { body } = await api('GET', '/api/user/list', { token: adminToken, query: { current: '1', size: '1' } });

    expect(body.code).toBe('0000');
  });

  it('普通用户访问已授权端点（menu/public）放行', async () => {
    const { body } = await api('GET', '/api/menu/public', { token: userToken });

    expect(body.code).toBe('0000');
  });

  it('普通用户访问未授权端点（user/list）返回 4003', async () => {
    const { body } = await api('GET', '/api/user/list', { token: userToken, query: { current: '1', size: '1' } });

    expect(body.code).toBe('4003');
  });

  it('公开菜单仅含 requiresAuth=N 菜单', async () => {
    const data = okData<Array<{ requiresAuth: string }>>(
      (await api<Array<{ requiresAuth: string }>>('GET', '/api/menu/public', { token: userToken })).body
    );

    expect(data.length).toBeGreaterThan(0);
    expect(data.every(row => row.requiresAuth === 'N')).toBe(true);
  });

  it('role/user 返回当前用户角色码', async () => {
    const data = okData<Array<{ code: string }>>(
      (await api<Array<{ code: string }>>('GET', '/api/role/user', { token: userToken })).body
    );

    expect(data.map(role => role.code)).toContain('user');
  });

  it('menu/user 返回当前用户可见菜单（含公共菜单）', async () => {
    const data = okData<Array<{ id: string }>>(
      (await api<Array<{ id: string }>>('GET', '/api/menu/user', { token: userToken })).body
    );

    expect(data.length).toBeGreaterThan(0);
  });

  it('exist-path 判定已存在路由', async () => {
    const { body } = await api<{ exists: boolean }>('POST', '/api/menu/exist-path', {
      token: adminToken,
      body: { routeName: 'home' }
    });

    expect(okData<{ exists: boolean }>(body).exists).toBe(true);
  });

  it('exist-path 判定不存在路由', async () => {
    const { body } = await api<{ exists: boolean }>('POST', '/api/menu/exist-path', {
      token: adminToken,
      body: { routeName: 'definitely_not_exists' }
    });

    expect(okData<{ exists: boolean }>(body).exists).toBe(false);
  });
});

// ---------- 用户 CRUD ----------

describe('user CRUD', () => {
  it('create → list 查得 → update → get → assign roles → batch delete', async () => {
    // create
    const create = await api<{ id: string }>('POST', '/api/user', {
      token: adminToken,
      body: { username: `it_u_${runId}`, password: 'pass123456', fullName: '集成测试A' }
    });
    const created = okData<{ id: string }>(create.body);

    expect(created.id).toBeTruthy();
    createdIds.userIds.push(created.id);

    // list（按 username 过滤）
    const list = await api<{ total: number; list: Array<{ username: string }> }>('GET', '/api/user/list', {
      token: adminToken,
      query: { current: '1', size: '10', username: `it_u_${runId}` }
    });
    const page = okData<{ total: number; list: Array<{ username: string }> }>(list.body);

    expect(page.total).toBe(1);
    expect(page.list[0]?.username).toBe(`it_u_${runId}`);

    // update
    const update = await api<{ fullName: string }>('PUT', `/api/user/${created.id}`, {
      token: adminToken,
      body: { fullName: '集成测试A改' }
    });

    expect(okData<{ fullName: string }>(update.body).fullName).toBe('集成测试A改');

    // get
    const get = await api<{ id: string }>('GET', `/api/user/${created.id}`, { token: adminToken });

    expect(okData<{ id: string }>(get.body).id).toBe(created.id);

    // assign roles
    const roles = okData<Array<{ id: string }>>(
      (await api<Array<{ id: string }>>('GET', '/api/role/all', { token: adminToken })).body
    );
    const assign = await api('PUT', `/api/user/${created.id}/roles`, {
      token: adminToken,
      body: { roleIds: [roles[0]?.id].filter(Boolean) }
    });

    expect(assign.body.code).toBe('0000');

    // batch delete
    const del = await api('POST', '/api/user/batch-delete', { token: adminToken, body: { ids: [created.id] } });

    expect(del.body.code).toBe('0000');

    const after = await api('GET', `/api/user/${created.id}`, { token: adminToken });

    expect(after.body.code).toBe('2007');
  });

  it('get 不存在 id 返回业务码 2007', async () => {
    const { body } = await api('GET', '/api/user/not-exist-id', { token: adminToken });

    expect(body.code).toBe('2007');
  });

  it('create 缺密码返回业务码 3000', async () => {
    const { body } = await api('POST', '/api/user', { token: adminToken, body: { username: `no_pwd_${runId}` } });

    expect(body.code).toBe('3000');
  });
});

// ---------- 角色 CRUD ----------

describe('role CRUD', () => {
  it('create → detail(含 permissions) → update → permissions 分配 → batch delete', async () => {
    const create = await api<{ id: string }>('POST', '/api/role', {
      token: adminToken,
      body: { name: '集成角色', code: `it_role_${runId}` }
    });
    const created = okData<{ id: string }>(create.body);

    createdIds.roleIds.push(created.id);

    // permissions 分配
    const perms = okData<Array<{ id: string }>>(
      (await api<Array<{ id: string }>>('GET', '/api/permission/all', { token: adminToken })).body
    );
    const assign = await api('PUT', `/api/role/${created.id}/permissions`, {
      token: adminToken,
      body: { permissionIds: [perms[0]?.id].filter(Boolean) }
    });

    expect(assign.body.code).toBe('0000');

    // detail 含 permissions
    const detail = await api<{ permissions: Array<{ id: string }> }>('GET', `/api/role/${created.id}`, {
      token: adminToken
    });
    const roleDetail = okData<{ permissions: Array<{ id: string }> }>(detail.body);

    expect(roleDetail.permissions.length).toBe(1);

    // update
    const update = await api<{ name: string }>('PUT', `/api/role/${created.id}`, {
      token: adminToken,
      body: { name: '集成角色改' }
    });

    expect(okData<{ name: string }>(update.body).name).toBe('集成角色改');

    // batch delete
    const del = await api('POST', '/api/role/batch-delete', { token: adminToken, body: { ids: [created.id] } });

    expect(del.body.code).toBe('0000');
  });

  it('role/list 分页与 role/all 全量', async () => {
    const list = await api<{ total: number; current: number; size: number }>('GET', '/api/role/list', {
      token: adminToken,
      query: { current: '1', size: '1' }
    });
    const page = okData<{ total: number; current: number; size: number }>(list.body);

    expect(page.total).toBeGreaterThanOrEqual(2);
    expect(page.size).toBe(1);

    const all = okData<Array<{ id: string }>>(
      (await api<Array<{ id: string }>>('GET', '/api/role/all', { token: adminToken })).body
    );

    expect(all.length).toBeGreaterThanOrEqual(2);
  });
});

// ---------- 菜单 CRUD ----------

describe('menu CRUD', () => {
  it('create → tree 包含 → update → delete', async () => {
    const create = await api<{ id: string }>('POST', '/api/menu', {
      token: adminToken,
      body: {
        menuType: 'menu',
        name: '集成菜单',
        code: `M_it_${runId}`,
        requiresAuth: 'Y',
        order: 9999,
        routeName: `it_menu_${runId}`,
        routePath: `/it/menu/${runId}`
      }
    });
    const created = okData<{ id: string }>(create.body);

    createdIds.menuIds.push(created.id);

    const tree = okData<Array<{ id: string; children: Array<{ id: string }> }>>(
      (
        await api<Array<{ id: string; children: Array<{ id: string }> }>>('GET', '/api/menu/tree', {
          token: adminToken
        })
      ).body
    );

    expect(tree.some(node => node.id === created.id || node.children.some(child => child.id === created.id))).toBe(
      true
    );

    const update = await api<{ name: string }>('PUT', `/api/menu/${created.id}`, {
      token: adminToken,
      body: { name: '集成菜单改' }
    });

    expect(okData<{ name: string }>(update.body).name).toBe('集成菜单改');

    const del = await api('DELETE', `/api/menu/${created.id}`, { token: adminToken });

    expect(del.body.code).toBe('0000');
  });
});

// ---------- permission / api / org / dict / dict-item CRUD ----------

describe('permission / api CRUD', () => {
  it('permission create → list → delete', async () => {
    const code = `it:perm:${runId}`;
    const create = await api<{ id: string }>('POST', '/api/permission', {
      token: adminToken,
      body: { name: '集成权限', code, resourceType: 'other' }
    });
    const created = okData<{ id: string }>(create.body);

    const list = await api<{ list: Array<{ id: string }> }>('GET', '/api/permission/list', {
      token: adminToken,
      query: { current: '1', size: '10', code }
    });

    expect(okData<{ list: Array<{ id: string }> }>(list.body).list[0]?.id).toBe(created.id);

    const del = await api('DELETE', `/api/permission/${created.id}`, { token: adminToken });

    expect(del.body.code).toBe('0000');
  });

  it('api create → list → batch delete', async () => {
    const path = `/it/api/${runId}`;
    const create = await api<{ id: string }>('POST', '/api/api', {
      token: adminToken,
      body: { name: '集成接口', path, method: 'get' }
    });
    const created = okData<{ id: string }>(create.body);

    const list = await api<{ list: Array<{ id: string }> }>('GET', '/api/api/list', {
      token: adminToken,
      query: { current: '1', size: '10', path }
    });

    expect(okData<{ list: Array<{ id: string }> }>(list.body).list[0]?.id).toBe(created.id);

    const del = await api('POST', '/api/api/batch-delete', { token: adminToken, body: { ids: [created.id] } });

    expect(del.body.code).toBe('0000');
  });
});

describe('org CRUD', () => {
  it('org create → assign roles/users → update → delete', async () => {
    const create = await api<{ id: string }>('POST', '/api/org', {
      token: adminToken,
      body: { name: '集成组织', code: `it_org_${runId}` }
    });
    const created = okData<{ id: string }>(create.body);

    const roles = okData<Array<{ id: string }>>(
      (await api<Array<{ id: string }>>('GET', '/api/role/all', { token: adminToken })).body
    );

    const assignRoles = await api('PUT', `/api/org/${created.id}/roles`, {
      token: adminToken,
      body: { roleIds: [roles[0]?.id].filter(Boolean) }
    });

    expect(assignRoles.body.code).toBe('0000');

    const assignUsers = await api('PUT', `/api/org/${created.id}/users`, {
      token: adminToken,
      body: { userIds: ['U_admin'] }
    });

    expect(assignUsers.body.code).toBe('0000');

    const update = await api<{ name: string }>('PUT', `/api/org/${created.id}`, {
      token: adminToken,
      body: { name: '集成组织改' }
    });

    expect(okData<{ name: string }>(update.body).name).toBe('集成组织改');

    const del = await api('DELETE', `/api/org/${created.id}`, { token: adminToken });

    expect(del.body.code).toBe('0000');
  });
});

describe('dict / dict-item CRUD', () => {
  it('dict create → item create → item list → item update → 全链删除', async () => {
    const dictCreate = await api<{ id: string }>('POST', '/api/dict', {
      token: adminToken,
      body: { name: '集成字典', code: `it_dict_${runId}` }
    });
    const dict = okData<{ id: string }>(dictCreate.body);

    const itemCreate = await api<{ id: string }>('POST', '/api/dict-item', {
      token: adminToken,
      body: { dictId: dict.id, label: '选项A', value: 'a', order: 1 }
    });
    const item = okData<{ id: string }>(itemCreate.body);

    const itemList = await api<{ list: Array<{ id: string }> }>('GET', '/api/dict-item/list', {
      token: adminToken,
      query: { current: '1', size: '10', dictId: dict.id }
    });

    expect(okData<{ list: Array<{ id: string }> }>(itemList.body).list[0]?.id).toBe(item.id);

    const itemUpdate = await api<{ label: string }>('PUT', `/api/dict-item/${item.id}`, {
      token: adminToken,
      body: { label: '选项A改' }
    });

    expect(okData<{ label: string }>(itemUpdate.body).label).toBe('选项A改');

    const itemDel = await api('POST', '/api/dict-item/batch-delete', { token: adminToken, body: { ids: [item.id] } });

    expect(itemDel.body.code).toBe('0000');

    const dictDel = await api('DELETE', `/api/dict/${dict.id}`, { token: adminToken });

    expect(dictDel.body.code).toBe('0000');
  });

  it('batch-delete 空 ids 返回业务码 3000', async () => {
    const { body } = await api('POST', '/api/role/batch-delete', { token: adminToken, body: { ids: [] } });

    expect(body.code).toBe('3000');
  });
});
