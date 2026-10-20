import type { PageMeta } from '@ubean/vue';
import { DEFAULT_ORDER } from '@/constants/db';
import { MANAGE_MENU_TYPES } from '@/constants/manage';
import type { ManageMenuType } from '@/constants/manage';
import type { AppMenu } from './shared';

/**
 * 静态菜单的唯一来源：`src/pages/**` 的扫描结果。
 *
 * 入参必须来自 `virtual:ubean-pages` 的 `pages` —— 目录与外链是 `routable: false`
 * 的元数据页，`router.getRoutes()` 里看不到。
 * 详见 docs/v3-notes.md N-462。
 */

/** 扫描结果的一个页面条目（只取本函数消费的字段，便于单测构造） */
export interface MenuPageSource {
  name: string;
  route: string;
  layout?: string | string[] | false;
  cache?: boolean;
  isMeta?: boolean;
  routable?: boolean;
  pageMeta?: PageMeta | null;
}

/** `manage/api` 这类页面名 → 稳定 id（`M_manage_api_index`） */
export function menuIdOf(pageName: string): string {
  return `M_${snake(pageName)}`;
}

/** `ManageApiIndex` → `manage_api_index` */
function snake(input: string): string {
  return input
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
    .toLowerCase();
}

/** 页面 meta 的 `menuType`；缺省与非法值都当普通菜单（值域与 `MANAGE_MENU_TYPES` 同源）。
 * `button` / `other` 照原样保留（权限点会引用它们的 id），由 `buildMenuTree` 决定不进菜单树。 */
function menuTypeOf(meta: Record<string, unknown>): ManageMenuType {
  const raw = meta.menuType;

  return typeof raw === 'string' ? (MANAGE_MENU_TYPES.find(type => type === raw) ?? 'menu') : 'menu';
}

/** 页面是否该进菜单：标题/i18nKey 是「这是个菜单项」的标志，其余是明确的排除信号 */
export function isMenuPage(page: MenuPageSource): boolean {
  const meta = page.pageMeta?.meta ?? {};

  if (page.name === 'NotFound') return false;
  if (meta.hideInMenu) return false;
  if (page.layout === 'blank') return false;
  // 公开页（登录页、403/500）不是菜单项。**写在 `meta` 里**：ubean 生成器只把
  // 顶层 `requiresAuth: true` 发射到 `route.meta`，顶层 `false` 会被丢弃
  // （详见 src/router/guard/auth.ts 的注释与 test/specs/guards/page-meta-guard.test.ts）。
  if (meta.requiresAuth === false) return false;

  return Boolean(meta.title || meta.i18nKey);
}

/** 扫描清单 → 菜单行（`buildMenuTree` 的入参） */
export function deriveMenus(pages: readonly MenuPageSource[]): AppMenu[] {
  return pages.filter(isMenuPage).map(toMenuRow);
}

/** 页面 → 菜单行。字段与页面 meta 一一对应，没有额外的人工配置项 */
function toMenuRow(page: MenuPageSource): AppMenu {
  // 必须拷贝：扫描器把 `pageMeta.meta` 当缓存里的实时引用，改它会污染后续读取
  const meta = { ...page.pageMeta?.meta };
  const menuType = menuTypeOf(meta);
  /** 目录与外链都不是路由：`routeName` 留空，否则 dev 校验会去找一条不存在的路由 */
  const isRoute = menuType !== 'directory' && menuType !== 'link';

  return {
    id: menuIdOf(page.name),
    parentId: meta.menuParent ? menuIdOf(meta.menuParent) : null,
    name: meta.title ?? page.name,
    code: snake(page.name),
    menuType,
    // 目录保留 `routePath`（子项前缀校验靠它），外链两者都不要
    routeName: isRoute ? page.name : null,
    routePath: menuType === 'link' ? null : page.route,
    order: meta.order ?? DEFAULT_ORDER,
    icon: meta.icon ?? null,
    i18nKey: meta.i18nKey ?? null,
    href: optionalString(meta.href),
    iframeUrl: optionalString(meta.iframeUrl),
    keepAlive: page.cache === true ? 'Y' : 'N',
    multiTab: meta.multiTab ? 'Y' : 'N',
    pinned: meta.pinned ? 'Y' : 'N',
    // 同一份判定：读 `meta.requiresAuth`（它才真会落到 `route.meta`）
    requiresAuth: meta.requiresAuth === false ? 'N' : 'Y'
  };
}

/** meta 的可选字符串字段（`href` / `iframeUrl`）；非字符串当没写 */
function optionalString(raw: unknown): string | null {
  return typeof raw === 'string' && raw.length > 0 ? raw : null;
}
