import { describe, expect, it } from 'vitest';
import { buildApiPermissionCode, normalizeApiPermissionPath, normalizeRoutePath } from '@/shared/route';

/**
 * `normalizeRoutePath` 守卫（P3-11）。
 *
 * 回归背景：i18n 策略为 `prefix_except_default` 时，ubean 把每条页面路由
 * 注册在 `/:locale(en)?/about` 这样的 path 上；菜单树从 `router.getRoutes()`
 * 取 path 后原样 `router.push()`，会跳到字面量 `/:locale(en)?/about` → 404
 * （「点击菜单关于」的真实 bug）。
 */
describe('normalizeRoutePath', () => {
  it('剥掉 prefix_except_default 的可选 locale 段', () => {
    expect(normalizeRoutePath('/:locale(en)?/about')).toBe('/about');
    expect(normalizeRoutePath('/:locale(en)?/manage/dict-item')).toBe('/manage/dict-item');
  });

  it('剥掉 prefix_and_default 的多语言可选段与 prefix 的必填段', () => {
    expect(normalizeRoutePath('/:locale(en|zh)?/about')).toBe('/about');
    expect(normalizeRoutePath('/:locale(en|zh)/about')).toBe('/about');
  });

  it('根路径剥完仍返回根路径', () => {
    expect(normalizeRoutePath('/:locale(en)?')).toBe('/');
    expect(normalizeRoutePath('/:locale')).toBe('/');
  });

  it('无 locale 段的路径原样返回（no_prefix 策略 / 静态页面）', () => {
    expect(normalizeRoutePath('/about')).toBe('/about');
    expect(normalizeRoutePath('/manage/dict-item')).toBe('/manage/dict-item');
    expect(normalizeRoutePath('/')).toBe('/');
  });

  it('不改具名业务参数（只剥首段的 locale）', () => {
    expect(normalizeRoutePath('/user/:id')).toBe('/user/:id');
    expect(normalizeRoutePath('/about/:locale')).toBe('/about/:locale');
  });

  it('缺失前导斜杠时补上（防御性）', () => {
    expect(normalizeRoutePath('about')).toBe('/about');
  });
});

/**
 * API 权限码归一化（M-06）。
 *
 * 回归背景：`src/middleware/01.auth.ts` 原先用 `new URL(c.req.url).pathname`
 * 拼权限码，`GET /api/user/123` 产出 `api:get:(/user/123)`，而 seed 登记的是
 * `api:get:(/user/[id])` → 带路径参数的端点 RBAC 全部失效（要么误拒、要么在
 * 该权限被授予他人时误放）。根因是权限码要用**路由模板**而不是具体路径。
 */
describe('normalizeApiPermissionPath', () => {
  it('剥掉 /api/ 前缀（权限码里的 path 不含它）', () => {
    expect(normalizeApiPermissionPath('/api/user/list')).toBe('/user/list');
  });

  it('hono 路由模板的 :id 归一为 [id]（与接口管理页录入格式一致）', () => {
    expect(normalizeApiPermissionPath('/api/user/:id')).toBe('/user/[id]');
    expect(normalizeApiPermissionPath('/api/user/:id/roles')).toBe('/user/[id]/roles');
  });

  it('已是 [id] 形式时保持原样（幂等）', () => {
    expect(normalizeApiPermissionPath('/api/user/[id]')).toBe('/user/[id]');
  });

  it('无前缀时补前导斜杠（接口管理页允许不写 /api/）', () => {
    expect(normalizeApiPermissionPath('user/list')).toBe('/user/list');
  });

  it('不误伤静态路径里的冒号之外内容', () => {
    expect(normalizeApiPermissionPath('/api/dict-item/list')).toBe('/dict-item/list');
  });
});

describe('buildApiPermissionCode', () => {
  it('方法与路径拼成登记格式的权限码', () => {
    expect(buildApiPermissionCode('GET', '/api/user/list')).toBe('api:get:(/user/list)');
    expect(buildApiPermissionCode('POST', '/api/menu/exist-path')).toBe('api:post:(/menu/exist-path)');
  });

  it('带路径参数的端点产出模板码（这是 M-06 的修复点）', () => {
    expect(buildApiPermissionCode('GET', '/api/user/:id')).toBe('api:get:(/user/[id])');
    expect(buildApiPermissionCode('PUT', '/api/role/:id/permissions')).toBe('api:put:(/role/[id]/permissions)');
  });

  it('method 大小写不敏感', () => {
    expect(buildApiPermissionCode('get', '/api/user/list')).toBe(buildApiPermissionCode('GET', '/api/user/list'));
  });
});
