import { describe, expect, it } from 'vitest';
import type { ApiMenuRow } from '@/typings/app';
import { transformMenuToRoute } from './index';

/**
 * dynamic 菜单行 → 路由记录（P3-07 补 iframe 分支）。
 *
 * 覆盖三条分流：
 * - `menu` / `page`：有 `routePath` + `routeName` → 普通路由（缺页占位兜底）；
 * - `iframe`：不配 `routePath`，生成一条 `redirect → /iframe?url=` 的路由，
 *   让菜单项可跳转且 URL 不进路径段；
 * - `directory` / `link`：不产生路由（前者只是分组，后者由布局新窗口打开）。
 *
 * `views` 传空对象即代表「所有视图都缺失」，正好顺带验证占位兜底分支。
 */
function row(partial: Partial<ApiMenuRow>): ApiMenuRow {
  return {
    id: 'M_1',
    parentId: null,
    name: '示例',
    code: 'demo',
    menuType: 'menu',
    requiresAuth: 'Y',
    icon: null,
    i18nKey: null,
    order: 1,
    iframeUrl: null,
    href: null,
    routePath: null,
    routeName: null,
    routeLayout: null,
    routeComponent: null,
    routeRedirect: null,
    routeQueries: null,
    routeParams: null,
    keepAlive: 'N',
    multiTab: 'N',
    pinned: 'N',
    description: null,
    ...partial
  };
}

describe('transformMenuToRoute', () => {
  it('menu 行 → 普通路由', () => {
    const route = transformMenuToRoute(
      row({ menuType: 'menu', routePath: '/demo', routeName: 'Demo', routeComponent: 'layout.base$view.demo' }),
      {}
    );

    expect(route?.path).toBe('/demo');
    expect(route?.name).toBe('Demo');
    // 视图缺失时 component 取占位（单测环境下 import.meta.glob 为空集合，
    // 故此处只断言路由本身成型；占位分支在 dev 断言里会告警）
    expect(route?.meta?.title).toBe('示例');
  });

  it('page 行与 menu 行同构', () => {
    const route = transformMenuToRoute(row({ menuType: 'page', routePath: '/demo-page', routeName: 'DemoPage' }), {});

    expect(route?.path).toBe('/demo-page');
  });

  it('iframe 行 → redirect 到 /iframe?url=，不落路径段', () => {
    const route = transformMenuToRoute(
      row({ menuType: 'iframe', code: 'IframeDemo', iframeUrl: 'https://example.com/a?b=1' }),
      {}
    );

    expect(route?.path).toBe('/iframe/IframeDemo');
    expect(route?.name).toBe('IframeDemo');
    expect(route?.redirect).toEqual({ path: '/iframe', query: { url: 'https://example.com/a?b=1' } });
  });

  it('iframe 行缺 iframeUrl 时不产生路由（后端已有校验，前端兜底）', () => {
    expect(transformMenuToRoute(row({ menuType: 'iframe', iframeUrl: null }), {})).toBeNull();
  });

  it('directory / link / button 不产生路由', () => {
    expect(transformMenuToRoute(row({ menuType: 'directory', routePath: '/x', routeName: 'X' }), {})).toBeNull();
    expect(
      transformMenuToRoute(row({ menuType: 'link', href: 'https://example.com', routePath: '/x', routeName: 'X' }), {})
    ).toBeNull();
    expect(transformMenuToRoute(row({ menuType: 'button', code: 'btn' }), {})).toBeNull();
  });

  it('menu 行缺 routePath 或 routeName → null', () => {
    expect(transformMenuToRoute(row({ menuType: 'menu', routeName: 'OnlyName' }), {})).toBeNull();
    expect(transformMenuToRoute(row({ menuType: 'menu', routePath: '/only-path' }), {})).toBeNull();
  });
});
