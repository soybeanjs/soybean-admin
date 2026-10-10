import type { RouteComponent, RouteRecordRaw } from 'vue-router';
import { defineStore } from 'pinia';
import { toAppRouteMeta } from '@/utils/route-meta';
import { fetchGetUserMenus } from '@/service/api/menu';
import { env } from '@/env';
import { getRouter } from '@/router/instance';
import type { ApiMenuRow, AppRouteMeta, MenuTreeNode } from '@/typings/app';

/**
 * 菜单 store（v3 §5.3，菜单/路由/标题一元模型的菜单侧）。
 *
 * - static 模式：从本地文件路由的 `definePage({ meta })` 派生菜单；
 * - dynamic 模式：`GET /api/menu/user` 菜单行 → 树 + `getRouter().addRoute`
 *   动态路由（`transformMenuToRoute`），并做启动期一致性断言（P2-04）。
 *
 * 标题单一来源：节点携带 `i18nKey`，**翻译在展示层**（layout/tab 的 setup
 * 上下文里 `t(i18nKey) || label`）—— `useI18n()` 只能在 setup 用，store
 * 不能在 action 里解析 locale（否则切语言后 label 不更新）。
 *
 * 为什么静态 import `router` 不构成循环依赖：`@/router` 只依赖 progress 与
 * 常量；守卫（`@/router/guard`）才反向依赖 store，ESM 活绑定 + 函数体内
 * 延迟引用让环在调用期才解析。
 */

interface MenuState {
  /** 菜单树（展示层解析 i18nKey） */
  items: MenuTreeNode[];
  /** dynamic 模式的用户菜单行 */
  userMenus: ApiMenuRow[];
  /** 菜单是否已初始化（守卫只拉一次） */
  inited: boolean;
}

/** 可进菜单的 menuType（button/other 不进） */
const MENU_VISIBLE_TYPES: readonly ApiMenuRow['menuType'][] = ['directory', 'menu', 'page', 'iframe', 'link'];

/** src/views 下全部视图组件（Vite 编译期静态分析，勿改为运行时拼接）。
 * .vue 模块的真实形状是 `{ default: Component }`，恰好匹配 vue-router
 * 惰性组件的 `Lazy<Promise<{ default: T }>>` 形状，无需断言 */
const viewModules = import.meta.glob<{ default: RouteComponent }>('@/views/**/*.vue');

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
      const map = new Map<string, ApiMenuRow>();

      for (const row of state.userMenus) {
        if (row.routeName) map.set(row.routeName, row);
      }
      return map;
    }
  },
  actions: {
    /** 初始化菜单（登录后守卫调用；幂等） */
    async initMenu() {
      if (this.inited) return;

      if (env.authRouteMode === 'dynamic') {
        await this.initDynamicMenu();
      } else {
        this.initStaticMenu();
      }
      this.inited = true;
    },

    // ------------------------------------------------------------------
    // static 模式：文件路由 meta → 菜单
    // ------------------------------------------------------------------

    initStaticMenu() {
      this.items = buildStaticMenuTree(
        getRouter()
          .getRoutes()
          .map(route => ({ name: String(route.name), path: route.path, meta: toAppRouteMeta(route.meta) }))
      );
    },

    // ------------------------------------------------------------------
    // dynamic 模式：菜单行 → 动态路由 + 菜单树
    // ------------------------------------------------------------------

    async initDynamicMenu() {
      this.userMenus = await fetchGetUserMenus();

      // 先注册路由（保证菜单树里的 routeName 都可导航）
      const routes = this.userMenus
        .map(row => transformMenuToRoute(row, viewModules))
        .filter((route): route is RouteRecordRaw => route !== null);

      for (const route of routes) {
        if (!route.name || !getRouter().hasRoute(route.name)) getRouter().addRoute(route);
      }

      this.items = this.buildMenuTree(this.userMenus);
      this.assertRouteConsistency();
    },

    /** 平铺菜单行 → 树（按 order 排序；孤儿行挂顶层，不丢菜单）。叶子节点
     * 携带 path，供 layout 选中菜单时按路径跳转 */
    buildMenuTree(rows: ApiMenuRow[]): MenuTreeNode[] {
      const nodeMap = new Map<string, MenuTreeNode>();
      const rowMap = new Map(rows.map(row => [row.id, row]));

      for (const row of rows) {
        if (!MENU_VISIBLE_TYPES.includes(row.menuType)) continue;

        nodeMap.set(row.id, {
          value: row.routeName || row.code,
          label: row.name,
          i18nKey: row.i18nKey ?? undefined,
          icon: row.icon ?? undefined,
          path: row.routePath ?? undefined,
          // 外链/内嵌页（P3-07）：没有可导航的内部 path，改由布局的
          // onMenuSelect 分别走「新窗口打开」与「/?url= 跳转」。
          href: row.menuType === 'link' && row.href ? row.href : undefined,
          iframeUrl: row.menuType === 'iframe' && row.iframeUrl ? row.iframeUrl : undefined
        });
      }

      const roots: MenuTreeNode[] = [];

      for (const row of rows) {
        if (!MENU_VISIBLE_TYPES.includes(row.menuType)) continue;

        const node = nodeMap.get(row.id);
        if (!node) continue;

        const parent = row.parentId ? nodeMap.get(row.parentId) : undefined;
        if (parent) {
          parent.children ??= [];
          parent.children.push(node);
        } else {
          roots.push(node);
        }
      }

      const sortTree = (nodes: MenuTreeNode[]) => {
        nodes.sort((a, b) => (rowMap.get(a.value)?.order ?? 0) - (rowMap.get(b.value)?.order ?? 0));
        for (const node of nodes) {
          if (node.children) sortTree(node.children);
        }
      };
      sortTree(roots);

      return roots;
    },

    // ------------------------------------------------------------------
    // P2-04 一致性断言：菜单 view ↔ 本地可用视图
    // ------------------------------------------------------------------

    /**
     * dev 下断言 dynamic 菜单与本地视图的一致性，输出缺页清单。
     * 菜单指向的 `view.*` 组件在 `src/views/**` 不存在时告警（不阻断启动，
     * 路由落到 `src/views/placeholder.vue`）。
     */
    assertRouteConsistency() {
      if (!import.meta.env.DEV || typeof window === 'undefined') return;

      const available = availableViewNames();
      const missing: string[] = [];

      for (const row of this.userMenus) {
        if (row.menuType !== 'menu' && row.menuType !== 'page') continue;

        const viewName = parseViewName(row.routeComponent);
        if (viewName && !available.has(viewName)) {
          missing.push(`${row.routeName ?? row.code} → view.${viewName}`);
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

/** 静态菜单的建树输入（调用方已把 vue-router 的 RouteMeta 收窄过） */
export interface StaticMenuRoute {
  name: string;
  path: string;
  meta: AppRouteMeta;
}

/**
 * 静态模式菜单树（P3-10）。
 *
 * 文件式路由不产生嵌套（`src/pages/multi-menu/**` 扫出来是 4 条平级记录），
 * 所以层级用 `meta.menuParent` 显式声明，而不是从 path 前缀猜：
 * path 前缀推断会把 `/manage/*` 八套管理页也折叠进一个大目录，
 * 那是导航结构的改变，不是演示页能自行决定的事。
 *
 * 父节点缺失（拼错 `menuParent`）时降级为一级菜单并告警，不丢菜单。
 * 隐藏页（`hideInMenu`）在建树前已被过滤：它只靠 `meta.activeMenu` 让布局
 * 高亮不掉，不参与菜单树。
 */
export function buildStaticMenuTree(routes: readonly StaticMenuRoute[]): MenuTreeNode[] {
  const entries = routes.filter(route => route.name && route.name !== 'NotFound');

  const visible = entries.filter(entry => !entry.meta.hideInMenu && Boolean(entry.meta.title || entry.meta.i18nKey));
  const nodeMap = new Map<string, MenuTreeNode>();
  const orderMap = new Map<string, number>();

  for (const entry of visible) {
    nodeMap.set(entry.name, toStaticMenuNode(entry));
    orderMap.set(entry.name, entry.meta.order ?? 0);
  }

  const roots: MenuTreeNode[] = [];

  for (const entry of visible) {
    const node = nodeMap.get(entry.name);
    if (!node) continue;

    const parent = resolveStaticMenuParent(entry, nodeMap, entries);

    if (parent) {
      parent.children ??= [];
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }

  sortMenuNodes(roots, orderMap);

  return roots;
}

function toStaticMenuNode(entry: StaticMenuRoute): MenuTreeNode {
  return {
    value: entry.name,
    label: String(entry.meta.title ?? entry.name),
    i18nKey: entry.meta.i18nKey,
    icon: entry.meta.icon,
    path: entry.path,
    // `meta.href` / `meta.iframeUrl`（P3-07）：静态页也可以声明成外链菜单项
    // （v3 §4.2「meta.href 行为保留」）。有它就不用 `path` 导航，
    // 布局的 onMenuSelect 会分流到新窗口 / 内嵌页。
    href: entry.meta.href,
    iframeUrl: entry.meta.iframeUrl
  };
}

function resolveStaticMenuParent(
  entry: StaticMenuRoute,
  nodeMap: Map<string, MenuTreeNode>,
  allEntries: readonly StaticMenuRoute[]
): MenuTreeNode | undefined {
  const parentName = entry.meta.menuParent || undefined;

  if (!parentName) return undefined;

  const parent = nodeMap.get(parentName);

  if (!parent) {
    // 降级为一级菜单而不是丢菜单：拼错 menuParent 时菜单还在，只是层级不对
    console.warn(
      `[menu] ${entry.name} 声明的父菜单 ${parentName} 不在菜单中（已完成 ${allEntries.length} 条路由的建树，降级为一级菜单）`
    );
  }

  return parent;
}

/** 按 `order` 递归排序（同级稳定；缺 order 视为 0） */
function sortMenuNodes(nodes: MenuTreeNode[], orderMap: Map<string, number>): void {
  nodes.sort((a, b) => (orderMap.get(a.value) ?? 0) - (orderMap.get(b.value) ?? 0));

  for (const node of nodes) {
    if (node.children) sortMenuNodes(node.children, orderMap);
  }
}

/** 根 → 目标节点的菜单链（全局搜索/多级菜单演示用；无命中返回空数组） */
export function findMenuTrail(nodes: readonly MenuTreeNode[], value: string): MenuTreeNode[] {
  for (const node of nodes) {
    if (node.value === value) return [node];

    const inner = node.children ? findMenuTrail(node.children, value) : [];

    if (inner.length > 0) return [node, ...inner];
  }

  return [];
}

/** `layout.base$view.system_user` → `system_user` */
export function parseViewName(routeComponent: string | null): string | null {
  if (!routeComponent) return null;

  const match = /view(?:_|\.)?([\w-]+)/.exec(routeComponent);

  return match ? match[1] : null;
}

/** src/views 的可用视图名集合：'system/user/index.vue' → 'system_user' */
export function availableViewNames(): Set<string> {
  const names = new Set<string>();

  for (const key of Object.keys(viewModules)) {
    names.add(viewKeyToName(key));
  }
  return names;
}

/** glob 键 → 视图名：'/src/views/system/user/index.vue' → 'system_user' */
function viewKeyToName(key: string): string {
  return key
    .replace(/^.*\/views\//, '')
    .replace(/\.vue$/, '')
    .replace(/\/index$/, '')
    .replace(/\//g, '_');
}

/** dynamic 菜单行 → 路由记录（menu|page 且有 routePath/routeName；iframe 落到内嵌页；缺页占位兜底） */
export function transformMenuToRoute(
  row: ApiMenuRow,
  views: Record<string, () => Promise<{ default: RouteComponent }>>
): RouteRecordRaw | null {
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

  const viewName = parseViewName(row.routeComponent);
  const viewKey = viewName ? Object.keys(views).find(key => viewKeyToName(key) === viewName) : undefined;

  if (!viewKey && import.meta.env.DEV && typeof window !== 'undefined') {
    console.warn(`[menu] 视图缺失：${row.routeName} → view.${viewName ?? '(未配置)'}，使用占位组件`);
  }

  const meta: AppRouteMeta = {
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

  const component = viewKey ? views[viewKey] : views['/src/views/placeholder.vue'];

  return {
    path: row.routePath,
    name: row.routeName,
    component,
    meta
  };
}
