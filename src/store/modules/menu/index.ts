import type { RouteComponent, RouteRecordRaw, Router } from 'vue-router';
import { defineStore } from 'pinia';
import { env } from '@/env';
import menusSource from '@/menus/menus.json';
import { api } from '@/request';
import type { MenuResource } from '@/schema/menu';
import type { MenuTreeNode } from '@/typings/app';
import { buildMenuTree, loadStaticMenus, normalizeRoutePath, parseMenuSource, validateMenuRoutes } from './shared';

/**
 * 菜单 store（v3 §5.3，菜单/路由/标题一元模型的菜单侧）。
 *
 * 两份菜单源，同一棵菜单树（`docs/v3-menu-route-modes.md` §4）：
 *
 * - static 模式：`src/menus/menus.json`（仓库里的源数据）+ 生成的路由表；
 * - dynamic 模式：`GET /api/menu/user`（数据库里的源数据，seed 自同一份 JSON）。
 *
 * 两条路径在建树前收敛成 `AppMenu[]`（见 `./shared.ts`），所以层级与排序只有
 * 一套行为。static 模式**不注册路由**（文件路由本来就全注册），只建树；
 * dynamic 模式既注册路由又建树 —— 这是两者唯一的实质差异。
 *
 * 标题单一来源：节点携带 `i18nKey`，**翻译在展示层**（layout/tab 的 setup
 * 上下文里 `t(i18nKey) || label`）—— `useI18n()` 只能在 setup 用，store
 * 不能在 action 里解析 locale（否则切语言后 label 不更新）。
 *
 * 为什么 router 从参数进而不 import：读路由表/注册路由都需要实例，而实例只有
 * 守卫与组件拿得到（`useRouter()`）。让调用方传进来，store 就不依赖 `@/router`，
 * `store → @/router → guard → store` 的模块环自然消失。守卫是唯一调用点，
 * 它拿到的正是框架 `setup` 入参。
 */

interface MenuState {
  /** 菜单树（展示层解析 i18nKey） */
  items: MenuTreeNode[];
  /** dynamic 模式的用户菜单行 */
  userMenus: MenuResource[];
  /** 菜单是否已初始化（守卫只拉一次） */
  inited: boolean;
}

/** src/pages 下全部视图组件（Vite 编译期静态分析，勿改为运行时拼接）。
 * .vue 模块的真实形状是 `{ default: Component }`，恰好匹配 vue-router
 * 惰性组件的 `Lazy<Promise<{ default: T }>>` 形状，无需断言 */
const viewModules = import.meta.glob<{ default: RouteComponent }>('@/pages/**/*.vue');

export const useMenuStore = defineStore('menu', {
  state: (): MenuState => ({
    items: [],
    userMenus: [],
    inited: false
  }),
  getters: {
    /** 菜单树是否为空 */
    isEmpty: state => state.items.length === 0,
    /** dynamic 路由名 → 菜单行（页签/权限判定用） */
    routeNameMap: state => {
      const map = new Map<string, MenuResource>();

      for (const row of state.userMenus) {
        if (row.routeName) map.set(row.routeName, row);
      }
      return map;
    }
  },
  actions: {
    /** 初始化菜单（登录后守卫调用；幂等） */
    async initMenu(router: Router) {
      if (this.inited) return;

      if (env.authRouteMode === 'dynamic') {
        await this.initDynamicMenu(router);
      } else {
        this.initStaticMenu(router);
      }
      this.inited = true;
    },

    // ------------------------------------------------------------------
    // static 模式：menus.json + 路由表 → 菜单树
    // ------------------------------------------------------------------

    /**
     * 从仓库里的菜单源数据建树。
     *
     * 路由只用来两件事：把 `routeName` 解析成真实 `path`（消除「页面改名 →
     * 菜单跳 404」的漂移，见 `loadStaticMenus`），以及 dev 下校验两者对齐。
     * 路由**不参与建树** —— 层级来自菜单自己的 `parentId`。
     */
    initStaticMenu(router: Router) {
      const routes = router.getRoutes().map(route => ({ name: String(route.name), path: route.path }));
      const menus = loadStaticMenus(parseMenuSource(menusSource), routes);

      if (import.meta.env.DEV && typeof window !== 'undefined') {
        const problems = validateMenuRoutes(menus, routes);

        if (problems.length > 0) {
          console.warn(`[menu] 静态菜单与路由表不一致（${problems.length} 项）：\n  ${problems.join('\n  ')}`);
        }
      }

      this.items = buildMenuTree(menus);
    },

    // ------------------------------------------------------------------
    // dynamic 模式：菜单行 → 动态路由 + 菜单树
    // ------------------------------------------------------------------

    async initDynamicMenu(router: Router) {
      this.userMenus = await api.get('/menu/user');

      // 先注册路由（保证菜单树里的 routeName 都可导航）
      const routes = this.userMenus
        .map(row => transformMenuToRoute(row, viewModules))
        .filter((route): route is RouteRecordRaw => route !== null);

      for (const route of routes) {
        if (!route.name || !router.hasRoute(route.name)) router.addRoute(route);
      }

      this.items = buildMenuTree(this.userMenus);
      this.assertRouteConsistency();
    },

    /**
     * dev 下断言 dynamic 菜单与本地视图的一致性，输出缺页清单。
     *
     * 菜单指向的视图在 `src/pages/**` 不存在时告警（不阻断启动，路由落到
     * `src/pages/_placeholder.vue`）。
     */
    assertRouteConsistency() {
      if (!import.meta.env.DEV || typeof window === 'undefined') return;

      const missing: string[] = [];

      for (const row of this.userMenus) {
        if (row.menuType !== 'menu' && row.menuType !== 'page') continue;

        if (!resolveViewKey(row.routeComponent)) {
          missing.push(`${row.routeName ?? row.code} → ${row.routeComponent ?? '(未配置 routeComponent)'}`);
        }
      }

      if (missing.length > 0) {
        console.warn(
          `[menu] 动态菜单缺页清单（${missing.length} 项，路由将使用占位组件）：\n  ${missing.join('\n  ')}`
        );
      }
    },

    /** 重置（登出时调用；动态路由随整页刷新失效，无需逐个 removeRoute） */
    resetStore() {
      this.items = [];
      this.userMenus = [];
      this.inited = false;
    }
  }
});

// ---------------------------------------------------------------------------
// 纯函数（store 外，便于单测）
// ---------------------------------------------------------------------------

/**
 * `src/pages` 下视图相对路径的 glob 前缀。
 *
 * `import.meta.glob` 的键是相对项目根的绝对样路径（`/src/pages/...`），
 * 而 `routeComponent` 存的是页面相对路径（`manage/user/index.vue`）——
 * 短、可读、与文件系统一一对应，工具（`scripts/menu-sync.ts`）能直接生成。
 */
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

/**
 * `routeComponent` → `import.meta.glob` 的键（视图不存在时 undefined）。
 *
 * 两种编码都认：
 * - `src/pages` 下的相对路径（`manage/user/index.vue`）—— 现行格式，
 *   工具可直接生成，人也能一眼对到文件；
 * - legacy 的 `layout.base$view.system_user` —— v2/elegant-router 时代的
 *   存量数据（含 `src/db/seed-data.ts` 的历史行），按视图名反查。
 */
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
  // iframe（P3-07）：菜单行不配 routePath/routeName，但菜单需要一个可跳转的
  // 路由名 —— 统一复用内置的 `/iframe` 页，地址通过 query.url 下发。
  // 这里刻意不生成 `[url].vue` 动态段：URL 含 `//` 与 `?`，当路径段会被
  // router 拆碎，query 才是稳定表达。
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
    // ubean 的 keep-alive 契约字段：PageView 靠 `$route.meta.pageName` 决定是否给
    // 组件套 `getNamedPageWrapper`（包装组件的 `name` 才能被 `<KeepAlive :include>`
    // 命中）。静态页由生成器写入（`@ubean/vue` 的 buildRouteMeta），dynamic 路由
    // 没有 → `cache: true` 会静默失效。
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
 *
 * 实现住在 `./shared.ts`（与建树同一个纯函数模块），这里只做转导出：菜单
 * store 是 UI 层唯一入口，消费方（如多级菜单面板）不需要知道纯函数的分层。
 */
export { findMenuTrail } from './shared';
