import { computed, ref } from 'vue';
import type { RouteComponent, RouteRecordRaw, Router } from 'vue-router';
import { defineStore } from 'pinia';
import { AUTH_ROUTE_MODE as ENV_AUTH_ROUTE_MODE } from 'ubean:env/client';
import menusSource from '@/menus/menus.json';
import { api } from '@/request';
import type { MenuResource } from '@/schema/menu';
import type { MenuTreeNode } from '@/typings/app';
import { buildMenuTree, loadStaticMenus, normalizeRoutePath, parseMenuSource, validateMenuRoutes } from './shared';

/** 不能在 action 里解析 locale（否则切语言后 label 不更新） 详见 docs/v3-notes.md N-103。 */

/** src/pages 下全部视图组件（Vite 编译期静态分析，勿改为运行时拼接）。
 * .vue 模块的真实形状是 `{ default: Component }`，恰好匹配 vue-router
 * 惰性组件的 `Lazy<Promise<{ default: T }>>` 形状，无需断言 */
const viewModules = import.meta.glob<{ default: RouteComponent }>('@/pages/**/*.vue');

export const useMenuStore = defineStore('menu', () => {
  /** 菜单树（展示层解析 i18nKey） */
  const items = ref<MenuTreeNode[]>([]);
  /** dynamic 模式的用户菜单行 */
  const userMenus = ref<MenuResource[]>([]);
  /** 菜单是否已初始化（守卫只拉一次） */
  const inited = ref(false);

  /** 菜单树是否为空 */
  const isEmpty = computed(() => items.value.length === 0);

  /** 从仓库里的菜单源数据建树 详见 docs/v3-notes.md N-104。 */
  function initStaticMenu(router: Router): void {
    const routes = router.getRoutes().map(route => ({ name: String(route.name), path: route.path }));
    const menus = loadStaticMenus(parseMenuSource(menusSource), routes);

    if (import.meta.env.DEV && typeof window !== 'undefined') {
      const problems = validateMenuRoutes(menus, routes);

      if (problems.length > 0) {
        console.warn(`[menu] 静态菜单与路由表不一致（${problems.length} 项）：\n  ${problems.join('\n  ')}`);
      }
    }

    items.value = buildMenuTree(menus);
  }

  /** dev 下断言 dynamic 菜单与本地视图的一致性，输出缺页清单 详见 docs/v3-notes.md N-105。 */
  function assertRouteConsistency(): void {
    if (!import.meta.env.DEV || typeof window === 'undefined') return;

    const missing: string[] = [];

    for (const row of userMenus.value) {
      if (row.menuType !== 'menu' && row.menuType !== 'page') continue;

      if (!resolveViewKey(row.routeComponent)) {
        missing.push(`${row.routeName ?? row.code} → ${row.routeComponent ?? '(未配置 routeComponent)'}`);
      }
    }

    if (missing.length > 0) {
      console.warn(`[menu] 动态菜单缺页清单（${missing.length} 项，路由将使用占位组件）：\n  ${missing.join('\n  ')}`);
    }
  }

  async function initDynamicMenu(router: Router): Promise<void> {
    userMenus.value = await api.get('/menu/user');

    // 先注册路由（保证菜单树里的 routeName 都可导航）
    const routes = userMenus.value
      .map(row => transformMenuToRoute(row, viewModules))
      .filter((route): route is RouteRecordRaw => route !== null);

    for (const route of routes) {
      if (!route.name || !router.hasRoute(route.name)) router.addRoute(route);
    }

    items.value = buildMenuTree(userMenus.value);
    assertRouteConsistency();
  }

  /** 初始化菜单（登录后守卫调用；幂等） */
  async function initMenu(router: Router): Promise<void> {
    if (inited.value) return;

    if (ENV_AUTH_ROUTE_MODE === 'dynamic') {
      await initDynamicMenu(router);
    } else {
      initStaticMenu(router);
    }
    inited.value = true;
  }

  /** 重置（登出时调用；动态路由随整页刷新失效，无需逐个 removeRoute） */
  function resetStore(): void {
    items.value = [];
    userMenus.value = [];
    inited.value = false;
  }

  return {
    items,
    userMenus,
    inited,
    isEmpty,
    initMenu,
    initStaticMenu,
    initDynamicMenu,
    assertRouteConsistency,
    resetStore
  };
});

// ---------------------------------------------------------------------------
// 纯函数（store 外，便于单测）
// ---------------------------------------------------------------------------

/** `src/pages` 下视图相对路径的 glob 前缀。`import.meta.glob` 的键是相对项目根的绝对样路径（`/src/pages/...`），而 `routeComponent`。 */
const VIEW_MODULE_PREFIX = '/src/pages/';

/** `layout.base$view.system_user` → `system_user`（legacy elegant-router 编码） */
export function parseViewName(routeComponent: string | null): string | null {
  if (!routeComponent) return null;

  const match = /view(?:_|\.)?([\w-]+)/.exec(routeComponent);

  return match ? match[1] : null;
}

/** glob 键 → 视图名：'/src/pages/manage/user/index.vue' → 'manage_user' */
function viewKeyToName(key: string): string {
  return key
    .replace(/^.*\/pages\//, '')
    .replace(/\.vue$/, '')
    .replace(/\/index$/, '')
    .replace(/\//g, '_');
}

/** 两种编码都认： 详见 docs/v3-notes.md N-107。 */
function resolveViewKey(routeComponent: string | null): string | undefined {
  if (!routeComponent) return undefined;

  if (routeComponent.startsWith('layout.')) {
    const viewName = parseViewName(routeComponent);

    return viewName ? Object.keys(viewModules).find(key => viewKeyToName(key) === viewName) : undefined;
  }

  const key = routeComponent.startsWith(VIEW_MODULE_PREFIX)
    ? routeComponent
    : `${VIEW_MODULE_PREFIX}${routeComponent.replace(/^\/?/, '')}`;

  return key in viewModules ? key : undefined;
}

/** dynamic 菜单行 → 路由记录（menu|page 且有 routePath/routeName；iframe 落到内嵌页；缺页占位兜底） */
export function transformMenuToRoute(row: MenuResource, views: typeof viewModules): RouteRecordRaw | null {
  // iframe（P3-07）：菜单行不配 routePath/routeName，但菜单需要一个可跳转的 详见 docs/v3-notes.md N-108。
  if (row.menuType === 'iframe' && row.iframeUrl) {
    return {
      path: `/iframe/${encodeURIComponent(row.code)}`,
      name: row.code,
      redirect: { path: '/iframe', query: { url: row.iframeUrl } },
      meta: {
        title: row.name,
        i18nKey: row.i18nKey ?? undefined,
        icon: row.icon ?? undefined,
        order: row.order,
        menuId: row.id,
        layout: row.routeLayout || 'default'
      }
    };
  }

  if (!row.routePath || !row.routeName || (row.menuType !== 'menu' && row.menuType !== 'page')) {
    return null;
  }

  const viewKey = resolveViewKey(row.routeComponent);

  if (!viewKey && import.meta.env.DEV && typeof window !== 'undefined') {
    console.warn(
      `[menu] 视图缺失：${row.routeName} → ${row.routeComponent ?? '(未配置 routeComponent)'}，使用占位组件`
    );
  }

  const meta = {
    // ubean 的 keep-alive 契约字段：PageView 靠 `$route.meta.pageName` 决定是否给 详见 docs/v3-notes.md N-109。
    pageName: row.routeName,
    title: row.name,
    i18nKey: row.i18nKey ?? undefined,
    icon: row.icon ?? undefined,
    order: row.order,
    cache: row.keepAlive === 'Y',
    multiTab: row.multiTab === 'Y',
    pinned: row.pinned === 'Y',
    menuId: row.id,
    layout: row.routeLayout || 'default'
  };

  const component = viewKey ? views[viewKey] : views['/src/pages/_placeholder.vue'];

  return {
    path: normalizeRoutePath(row.routePath),
    name: row.routeName,
    component,
    meta
  };
}

/**
 * 菜单树 → 根到目标节点的链路（全局搜索、多级菜单面包屑用）。
 * 实现住在 `./shared.ts`，这里只做转导出：消费方不需要知道纯函数的分层。
 */
export { findMenuTrail } from './shared';
