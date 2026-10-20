import { describe, expect, it } from 'vitest';
import { deriveMenus, isMenuPage, menuIdOf } from '@/store/modules/menu/derive';
import type { MenuPageSource } from '@/store/modules/menu/derive';

/**
 * 页面扫描结果 → 菜单行的派生规则单测。
 *
 * 入参用显式夹具而非真实 `virtual:ubean-pages`：断言的是**规则**，加一个页面不该
 * 让这里红一片（真实仓库的完整性由 `pnpm dev` 的 dev 校验与集成测试兜住）。
 * 详见 docs/v3-notes.md N-464。
 */
function page(name: string, partial: Partial<MenuPageSource> = {}): MenuPageSource {
  return { name, route: `/${name.toLowerCase()}`, ...partial };
}

/** 带 meta 的普通菜单页 */
function menuPage(name: string, meta: Record<string, unknown>, partial: Partial<MenuPageSource> = {}) {
  return page(name, { pageMeta: { meta }, ...partial });
}

describe('menuIdOf', () => {
  it('页面名 → 稳定 id（与旧 menus.json 的 id 方案一致）', () => {
    expect(menuIdOf('ManageApiIndex')).toBe('M_manage_api_index');
    expect(menuIdOf('Index')).toBe('M_index');
    expect(menuIdOf('DocumentationSoybeanUi')).toBe('M_documentation_soybean_ui');
    // 连续大写不能拆成 `documentation_soybean_u_i`
    expect(menuIdOf('AboutUiIndex')).toBe('M_about_ui_index');
  });
});

describe('isMenuPage', () => {
  it('有 title 或 i18nKey 才算菜单项', () => {
    expect(isMenuPage(menuPage('A', { title: '甲' }))).toBe(true);
    expect(isMenuPage(menuPage('B', { i18nKey: 'route.b' }))).toBe(true);
    expect(isMenuPage(menuPage('C', {}))).toBe(false);
  });

  it('hideInMenu 排除', () => {
    expect(isMenuPage(menuPage('A', { title: '甲', hideInMenu: true }))).toBe(false);
  });

  it('blank 布局排除（登录页 / 403 / 500）', () => {
    expect(isMenuPage(menuPage('A', { title: '甲' }, { layout: 'blank' }))).toBe(false);
  });

  it('meta.requiresAuth === false 排除（公开页不进菜单）', () => {
    expect(isMenuPage(menuPage('A', { title: '甲', requiresAuth: false }))).toBe(false);
  });

  it('顶层 requiresAuth: false 不算（ubean 生成器不发射它，守卫也读 meta）', () => {
    // 只有 meta 里那份会落到 route.meta，顶层 false 被静默丢弃
    expect(isMenuPage(page('A', { pageMeta: { requiresAuth: false, meta: { title: '甲' } } }))).toBe(true);
  });

  it('NotFound 排除', () => {
    expect(isMenuPage(menuPage('NotFound', { title: '找不到' }))).toBe(false);
  });

  it('pageMeta 缺失（未写 definePage）不算菜单项', () => {
    expect(isMenuPage(page('A'))).toBe(false);
  });
});

describe('deriveMenus', () => {
  it('只保留菜单页，并映射成 AppMenu', () => {
    const menus = deriveMenus([
      menuPage('Index', { title: '首页', i18nKey: 'route.home', icon: 'mdi:home', order: 1 }),
      menuPage('Hidden', { title: '藏起来', hideInMenu: true }),
      page('NoMeta')
    ]);

    expect(menus).toHaveLength(1);
    expect(menus[0]).toMatchObject({
      id: 'M_index',
      name: '首页',
      code: 'index',
      menuType: 'menu',
      routeName: 'Index',
      routePath: '/index',
      order: 1,
      icon: 'mdi:home',
      i18nKey: 'route.home',
      requiresAuth: 'Y',
      keepAlive: 'N',
      multiTab: 'N',
      pinned: 'N',
      href: null,
      iframeUrl: null
    });
  });

  it('order 缺省用 DEFAULT_ORDER（999），排到最后', () => {
    const menus = deriveMenus([menuPage('A', { title: '甲' })]);

    expect(menus[0]?.order).toBe(999);
  });

  it('cache: true → keepAlive Y；meta.multiTab / pinned → Y', () => {
    const menus = deriveMenus([menuPage('A', { title: '甲', multiTab: true, pinned: true }, { cache: true })]);

    expect(menus[0]).toMatchObject({ keepAlive: 'Y', multiTab: 'Y', pinned: 'Y' });
  });

  it('menuParent → parentId（用同一个 id 方案）', () => {
    const menus = deriveMenus([
      menuPage('ManageIndex', { title: '系统管理', menuType: 'directory', order: 2 }),
      menuPage('ManageUserIndex', { title: '用户管理', menuParent: 'ManageIndex' })
    ]);

    expect(menus[1]?.parentId).toBe('M_manage_index');
  });

  it('directory：保留 routePath（子项前缀校验靠它），不带 routeName', () => {
    const menus = deriveMenus([
      menuPage(
        'ManageIndex',
        { title: '系统管理', menuType: 'directory' },
        { route: '/manage', routable: false, isMeta: true }
      )
    ]);

    expect(menus[0]).toMatchObject({ menuType: 'directory', routePath: '/manage', routeName: null });
  });

  it('link：只要 href，路由字段一律为 null', () => {
    const menus = deriveMenus([
      menuPage(
        'DocumentationVue',
        { title: 'Vue 文档', menuType: 'link', href: 'https://cn.vuejs.org/' },
        { route: '/documentation/vue', routable: false, isMeta: true }
      )
    ]);

    expect(menus[0]).toMatchObject({
      menuType: 'link',
      href: 'https://cn.vuejs.org/',
      routeName: null,
      routePath: null,
      iframeUrl: null
    });
  });

  it('iframe：有 iframeUrl 与自己的路由（地址来自 meta，不靠查询串）', () => {
    const menus = deriveMenus([
      menuPage(
        'DocumentationProject',
        { title: '项目官网', menuType: 'iframe', iframeUrl: 'https://soybeanjs.cn/' },
        { route: '/documentation/project' }
      )
    ]);

    expect(menus[0]).toMatchObject({
      menuType: 'iframe',
      iframeUrl: 'https://soybeanjs.cn/',
      routeName: 'DocumentationProject',
      routePath: '/documentation/project',
      href: null
    });
  });

  it('非法 menuType 当普通菜单（值域由 picklist 收窄）', () => {
    const menus = deriveMenus([menuPage('A', { title: '甲', menuType: 'nonsense' })]);

    expect(menus[0]?.menuType).toBe('menu');
  });

  it('button / other 原样保留（权限点会引用它们的 id）', () => {
    const menus = deriveMenus([menuPage('A', { title: '甲', menuType: 'button' })]);

    expect(menus[0]?.menuType).toBe('button');
  });

  it('空字符串的 href / iframeUrl 当没写', () => {
    const menus = deriveMenus([menuPage('A', { title: '甲', menuType: 'link', href: '' })]);

    expect(menus[0]?.href).toBeNull();
  });

  it('不修改传入的 pageMeta.meta（扫描器缓存里的实时引用）', () => {
    const meta = { title: '甲', order: 5 };
    const menus = deriveMenus([menuPage('A', meta)]);

    menus[0]!.order = 1;

    expect(meta.order).toBe(5);
  });
});
