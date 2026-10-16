import { describe, expect, it } from 'vitest';
import { diffApiRoutes, formatApiRouteDiff } from '@/shared/api-route-sync';
import type { RegisteredRoute } from '@/shared/api-route-sync';

/** 路由 ↔ `api` 表对账（§5.2-5） 详见 docs/v3-notes.md N-428。 */
describe('diffApiRoutes', () => {
  const route = (method: string, path: string): RegisteredRoute => ({ method, path });

  it('两侧完全一致时无差异', () => {
    const routes = [route('GET', '/api/user/list'), route('POST', '/api/user')];
    const apis = [route('get', '/user/list'), route('post', '/user')];

    expect(diffApiRoutes(routes, apis)).toEqual({ missing: [], stale: [] });
  });

  it('把 hono 模板 :id 与 api 表的 [id] 视为同一条', () => {
    const routes = [route('GET', '/api/user/:id'), route('DELETE', '/api/user/:id')];
    const apis = [route('get', '/user/[id]'), route('delete', '/user/[id]')];

    expect(diffApiRoutes(routes, apis)).toEqual({ missing: [], stale: [] });
  });

  it('方法大小写不敏感', () => {
    const routes = [route('Get', '/api/user/list')];
    const apis = [route('GET', '/user/list')];

    expect(diffApiRoutes(routes, apis).missing).toHaveLength(0);
  });

  it('路由有、api 表没有 → missing（该端点无权限点可授予）', () => {
    const routes = [route('GET', '/api/user/list'), route('POST', '/api/dict')];
    const apis = [route('get', '/user/list')];

    const { missing, stale } = diffApiRoutes(routes, apis);

    expect(missing).toHaveLength(1);
    expect(missing[0]).toEqual({
      method: 'post',
      path: '/dict',
      code: 'api:post:(/dict)',
      sourcePath: '/dict'
    });
    expect(stale).toHaveLength(0);
  });

  it('api 表有、路由没有 → stale（幽灵行）', () => {
    const routes = [route('GET', '/api/user/list')];
    const apis = [route('get', '/user/list'), route('post', '/auth/token/refresh')];

    const { missing, stale } = diffApiRoutes(routes, apis);

    expect(missing).toHaveLength(0);
    expect(stale).toHaveLength(1);
    expect(stale[0].code).toBe('api:post:(/auth/token/refresh)');
    expect(stale[0].sourcePath).toBe('/auth/token/refresh');
  });

  it('同一条重复登记只报一次', () => {
    const routes = [route('GET', '/api/user/list'), route('get', '/api/user/list')];
    const apis: RegisteredRoute[] = [];

    expect(diffApiRoutes(routes, apis).missing).toHaveLength(1);

    // api 表重复行同理
    const dupApis = [route('get', '/user/list'), route('get', '/user/list')];

    expect(diffApiRoutes([], dupApis).stale).toHaveLength(1);
  });

  it('api 表的完整 URL 写法（带 /api 前缀）也算登记过', () => {
    const routes = [route('GET', '/api/user/list')];
    const apis = [route('get', '/api/user/list')];

    expect(diffApiRoutes(routes, apis)).toEqual({ missing: [], stale: [] });
  });

  it('真正以 /api 开头的业务路径（接口资源模块）不被误剥', () => {
    // `GET /api/api/list` 是「接口资源列表」，权限路径是 `/api/list`，
    // 而 api 表登记正是 `/api/list` —— 曾被剥成 `/list` 而误报
    const routes = [route('GET', '/api/api/list')];
    const apis = [route('get', '/api/list')];

    expect(diffApiRoutes(routes, apis)).toEqual({ missing: [], stale: [] });
  });

  it('无前缀写法同样算登记过', () => {
    const routes = [route('GET', '/api/user/list')];
    const apis = [route('get', 'user/list')];

    expect(diffApiRoutes(routes, apis)).toEqual({ missing: [], stale: [] });
  });

  it('空路由 + 空表 → 无差异（不误报）', () => {
    expect(diffApiRoutes([], [])).toEqual({ missing: [], stale: [] });
  });
});

describe('formatApiRouteDiff', () => {
  it('无差异时返回空数组（不留噪音日志）', () => {
    expect(formatApiRouteDiff({ missing: [], stale: [] })).toEqual([]);
  });

  it('缺登记时给出权限码与修法提示', () => {
    const lines = formatApiRouteDiff({
      missing: [{ method: 'get', path: '/dict/all', code: 'api:get:(/dict/all)', sourcePath: '/dict/all' }],
      stale: []
    });

    expect(lines[0]).toContain('1 条路由');
    expect(lines[1]).toContain('api:get:(/dict/all)');
    expect(lines.at(-1)).toContain('seed-data.ts');
  });

  it('幽灵行同时给出 api.path 原文，便于定位录入错误', () => {
    const lines = formatApiRouteDiff({
      missing: [],
      stale: [
        {
          method: 'post',
          path: '/auth/token/refresh',
          code: 'api:post:(/auth/token/refresh)',
          sourcePath: '/auth/token/refresh'
        }
      ]
    });

    expect(lines[0]).toContain('找不到对应路由');
    expect(lines[1]).toContain('/auth/token/refresh');
    expect(lines[1]).toContain('api.path');
  });
});
