import { parse } from 'valibot';
import { menuSourceFileSchema } from '@/schema/menu';
import type { MenuSource } from '@/schema/menu';
import type { MenuTreeNode } from '@/typings/app';
/**
 * 菜单纯函数与统一中间表示（`docs/v3-menu-route-modes.md` §4.3）。
 *
 * **为什么要有 `AppMenu`**：改造前 static 模式从 `router.getRoutes()` 直接建树、
 * dynamic 模式从 `MenuResource` 行建树 —— 两条路径各写一套过滤/排序/挂父逻辑，
 * 形状不同、能表达的东西也不同（static 靠 `meta.menuParent`、dynamic 靠
 * `parentId`）。现在两者在**建树之前**收敛成同一个 `AppMenu[]`：
 *
 * ```
 * static  →  src/menus/menus.json + 生成的路由表  ┐
 *                                                ├→  AppMenu[]  →  buildMenuTree()
 * dynamic →  GET /api/menu/user（DB 是同一个源） ┘
 * ```
 *
 * `buildMenuTree` 因此是**唯一建树点**：菜单树只有一份行为，不存在两种模式
 * 层级/排序不一致的可能。
 *
 * 它只带「菜单自己拥有」的字段：标题、图标、排序、层级、身份、开关。视图组件
 * 与布局仍留在菜单行上，但**菜单树不消费它们** —— 视图由路由表（static）或
 * 后端下发（dynamic）决定，菜单不该重复声明。
 *
 * 类型本体是 `src/schema/menu.ts` 的 `menuSourceSchema`（契约单一来源），这里
 * 只给业务代码一个短名，也是 static 模式的**信任边界**：JSON 是手编辑的文件，
 * `resolveJsonModule` 又会把字面量放宽成 `string`，所以过一遍 schema 才拿到窄
 * 类型（与 `src/utils/route-meta.ts` 收窄 `RouteMeta` 同一个套路）。
 */
export type AppMenu = MenuSource;

/** 可进菜单的 menuType（button/other 不进） */
const MENU_VISIBLE_TYPES: readonly AppMenu['menuType'][] = ['directory', 'menu', 'page', 'iframe', 'link'];

/**
 * 菜单 → 菜单树（唯一建树点）。
 *
 * 层级只认 `parentId`，不从 `routePath` 前缀猜：`/manage/*` 八套管理页在
 * 路由上同前缀，在菜单上是八个平级项，前缀推断会把它们折叠进一个大目录。
 *
 * 排序在**挂父之前**一次完成 —— 按 `order` 排好序后顺序 push 进各自父节点的
 * `children`，每一层自然有序，不再需要递归排序。
 *
 * 父节点缺失（`parentId` 指向不存在的 id，或父节点被 `menuType` 过滤掉）时
 * 降级为一级菜单，不丢菜单项。
 */
export function buildMenuTree(menus: readonly AppMenu[]): MenuTreeNode[] {
  const visible = menus.filter(menu => MENU_VISIBLE_TYPES.includes(menu.menuType));
  const ordered = [...visible].sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.id.localeCompare(b.id));

  const nodeMap = new Map<string, MenuTreeNode>();

  for (const menu of ordered) {
    nodeMap.set(menu.id, toMenuNode(menu));
  }

  const roots: MenuTreeNode[] = [];

  for (const menu of ordered) {
    const node = nodeMap.get(menu.id);
    if (!node) continue;

    const parent = menu.parentId ? nodeMap.get(menu.parentId) : undefined;

    if (parent) {
      parent.children ??= [];
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

function toMenuNode(menu: AppMenu): MenuTreeNode {
  return {
    value: menu.routeName || menu.code,
    label: menu.name,
    i18nKey: menu.i18nKey ?? undefined,
    icon: menu.icon ?? undefined,
    path: menu.routePath ?? undefined,
    // 外链/内嵌页：没有可导航的内部 path，布局的 onMenuSelect 分别走
    // 「新窗口打开」与「切到 /iframe 页」两条分支。
    href: menu.menuType === 'link' && menu.href ? menu.href : undefined,
    iframeUrl: menu.menuType === 'iframe' && menu.iframeUrl ? menu.iframeUrl : undefined
  };
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

/**
 * 解析菜单源文件（`src/menus/menus.json`）为 `AppMenu[]`。
 *
 * 唯一的信任边界：`menus.json` 是人手编辑的文件，而 `resolveJsonModule` 会把
 * JSON 字面量放宽成 `string`（`menuType` / `requiresAuth` 的窄类型丢失）。
 * 解析失败直接抛 —— 菜单源写错应该在启动时就暴露，而不是渲染出一棵缺项的树。
 */
export function parseMenuSource(raw: unknown): AppMenu[] {
  return parse(menuSourceFileSchema, raw).menus;
}

/** 路由表的一行（`router.getRoutes()` 的最小子集，便于单测） */
export interface MenuRouteEntry {
  name: string;
  path: string;
}

/**
 * static 模式的加载器：菜单源数据 + 路由表 → `AppMenu[]`。
 *
 * 只做一件事 —— **用路由表上的真实 path 覆盖菜单里写的 `routePath`**。
 * 菜单里的 `routePath` 是工具生成时的快照，页面文件改名后它就成了死数据，
 * `router.push` 会跳到不存在的地址；路由表才是当下的事实。路由表里查不到
 * 该 `routeName` 时保留菜单写的值（条目仍可见，问题交给
 * `validateMenuRoutes` 报出来）。
 *
 * 这也让「换父/改路径」可以在 JSON 里覆盖：手写的 `routePath` 在路由表命中
 * 时被覆盖、未命中时生效 —— 不需要动页面文件。
 */
export function loadStaticMenus(source: readonly AppMenu[], routes: readonly MenuRouteEntry[]): AppMenu[] {
  const pathByRouteName = new Map(routes.map(route => [route.name, normalizeRoutePath(route.path)]));

  return source.map(menu => ({
    ...menu,
    routePath: (menu.routeName ? pathByRouteName.get(menu.routeName) : undefined) ?? menu.routePath
  }));
}

/**
 * dev 一致性校验：菜单与路由表对齐（文档 §3 降级来的校验价值）。
 *
 * 三项来自两版路由插件的真实踩坑：
 *
 * 1. `routeName` 指向的路由不存在 —— 菜单点了没反应（或落 404）。legacy 时代
 *    改名页面文件就会静默产生这种菜单，是社区抱怨的来源之一。
 * 2. 菜单的 `routePath` 与路由表里该 name 的 `path` 不一致 —— `router.push`
 *    走的是 path，两边不一致就跳错页；`prefix_except_default` 下路由表的 path
 *    带 `/:locale(en)?` 前缀，故比较前先归一化。
 * 3. `directory` 行的 `routePath` 不是其子项 `routePath` 的前缀 —— 目录与子项
 *    在导航上分家了。目录没有对应路由（纯分组），这条是它唯一的自检。
 *
 * 只在 dev 调用，返回人类可读的问题清单（空数组 = 通过），由调用方决定打印与
 * 是否抛错 —— 纯函数不碰 console，便于单测。
 */
export function validateMenuRoutes(menus: readonly AppMenu[], routes: readonly MenuRouteEntry[]): string[] {
  const pathByRouteName = new Map(routes.map(route => [route.name, normalizeRoutePath(route.path)]));
  const problems: string[] = [];

  for (const menu of menus) {
    const label = menu.routeName ?? menu.code;

    if (menu.routeName && !(menu.menuType === 'directory' || menu.menuType === 'button')) {
      const routePath = pathByRouteName.get(menu.routeName);

      if (routePath === undefined) {
        problems.push(`${label}：路由 "${menu.routeName}" 不存在于生成的路由表`);
      } else if (menu.routePath && routePath !== normalizeRoutePath(menu.routePath)) {
        problems.push(`${label}：菜单路径 ${menu.routePath} 与路由 "${menu.routeName}" 的路径 ${routePath} 不一致`);
      }
    }

    if (menu.menuType === 'directory') {
      const prefix = normalizeRoutePath(menu.routePath ?? '');

      const orphans = menus.filter(child => child.parentId === menu.id && child.routePath);
      const outside = orphans.filter(child => !normalizeRoutePath(child.routePath ?? '').startsWith(`${prefix}/`));

      if (outside.length > 0) {
        problems.push(
          `${label}：目录路径 ${prefix} 不是子菜单路径的前缀（${outside.map(c => c.routePath).join('、')}）`
        );
      }
    }
  }

  return problems;
}

/**
 * 剥掉 vue-router 路径里的 locale 参数段（`/:locale(en)?/about` → `/about`）。
 *
 * 与 `src/shared/route.ts` 的同名函数是同一个规则 —— 这里复制一份是**刻意的**：
 * 本文件要被 `scripts/menu-sync.ts` 以普通 Node 进程加载，而 `@/shared/route.ts`
 * 会连带拉进 `hono`（`findHonoRouteByPath` / `requireParam` 的 import），
 * 在 Vite 之外无法解析。规则只有一条正则，重复的代价小于耦合。
 */
export function normalizeRoutePath(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const stripped = normalized.replace(/^\/:locale(\([^)]*\))?\??/, '');

  if (stripped === normalized) return normalized;

  return stripped === '' ? '/' : stripped;
}
