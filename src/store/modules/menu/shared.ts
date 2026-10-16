import { parse } from 'valibot';
import { menuSourceFileSchema } from '@/schema/menu';
import type { MenuSource } from '@/schema/menu';
import type { MenuTreeNode } from '@/typings/app';
/** 菜单纯函数与统一中间表示：static / dynamic 两条来源在建树前收敛为同一个 `AppMenu[]`，`buildMenuTree` 是唯一建树点。详见 docs/v3-notes.md N-111。 */
export type AppMenu = MenuSource;

/** 可进菜单的 menuType（button/other 不进） */
const MENU_VISIBLE_TYPES: readonly AppMenu['menuType'][] = ['directory', 'menu', 'page', 'iframe', 'link'];

/** 菜单 → 菜单树（唯一建树点） 详见 docs/v3-notes.md N-112。 */
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

/** 解析菜单源文件（`src/menus/menus.json`）为 `AppMenu[]` 详见 docs/v3-notes.md N-113。 */
export function parseMenuSource(raw: unknown): AppMenu[] {
  return parse(menuSourceFileSchema, raw).menus;
}

/** 路由表的一行（`router.getRoutes()` 的最小子集，便于单测） */
export interface MenuRouteEntry {
  name: string;
  path: string;
}

/** static 模式的加载器：菜单源数据 + 路由表 → `AppMenu[]` 详见 docs/v3-notes.md N-114。 */
export function loadStaticMenus(source: readonly AppMenu[], routes: readonly MenuRouteEntry[]): AppMenu[] {
  const pathByRouteName = new Map(routes.map(route => [route.name, normalizeRoutePath(route.path)]));

  return source.map(menu => ({
    ...menu,
    routePath: (menu.routeName ? pathByRouteName.get(menu.routeName) : undefined) ?? menu.routePath
  }));
}

/** 三项来自两版路由插件的真实踩坑： 详见 docs/v3-notes.md N-115。 */
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

/** 与 `src/shared/route.ts` 的同名函数是同一个规则 —— 这里复制一份是**刻意的**： 详见 docs/v3-notes.md N-116。 */
export function normalizeRoutePath(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const stripped = normalized.replace(/^\/:locale(\([^)]*\))?\??/, '');

  if (stripped === normalized) return normalized;

  return stripped === '' ? '/' : stripped;
}
