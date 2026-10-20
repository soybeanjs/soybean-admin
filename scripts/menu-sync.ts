import { readFileSync, renameSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ScannedPage } from '@ubean/scan';
import { scanPages } from '@ubean/vue/vite';

/** 菜单源数据是人写的（层级、标题、图标、排序都是审美决定），但「哪些页面，存在、路径是什么」是机器事实。本脚本只做这两件事之间的对账： 详见 docs/v3-notes.md N-391。 */

/** 与 `src/store/modules/menu/shared.ts` 的 `AppMenu` 对齐的字段顺序 详见 docs/v3-notes.md N-392。 */
const FIELD_ORDER = [
  'id',
  'parentId',
  'name',
  'code',
  'menuType',
  'requiresAuth',
  'routeName',
  'routePath',
  'routeComponent',
  'routeLayout',
  'routeRedirect',
  'routeQueries',
  'routeParams',
  'order',
  'icon',
  'i18nKey',
  'keepAlive',
  'multiTab',
  'pinned',
  'href',
  'iframeUrl',
  'description'
] as const;

/** `manage/api` 这类相对路径 → 稳定 id（`M_manage_api_index`） */
function snake(input: string): string {
  return input
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
    .toLowerCase();
}

type MenuRow = Record<string, string | number | null>;

/** 能出现在菜单里的 `menuType`（`button` / `other` 不进菜单，页面 meta 写了也当普通菜单） */
const MENU_TYPES_VISIBLE: ReadonlySet<string> = new Set(['directory', 'menu', 'page', 'iframe', 'link']);

/** 页面 meta 的 `menuType` → 菜单行类型；缺省与非法值一律当普通菜单 */
function menuTypeOf(meta: Record<string, unknown>): string {
  const raw = meta.menuType;

  return typeof raw === 'string' && MENU_TYPES_VISIBLE.has(raw) ? raw : 'menu';
}

/** 页面 meta 的可选字符串字段（`href` / `iframeUrl`）→ 菜单列；非字符串当没写 */
function optionalString(raw: unknown): string | null {
  return typeof raw === 'string' && raw.length > 0 ? raw : null;
}

/** 顶层 `src/pages` 相对路径 → 菜单行 id */
function menuIdOf(pageName: string): string {
  return `M_${snake(pageName)}`;
}

/** 页面是否该进菜单（与菜单 store 的过滤规则同源，见 shared.ts 的注释） */
function isMenuPage(page: ScannedPage): boolean {
  const meta = page.pageMeta?.meta ?? {};

  if (page.name === 'NotFound') return false;
  if (meta.hideInMenu) return false;
  if (page.layout === 'blank') return false;
  if (meta.requiresAuth === false) return false;

  return Boolean(meta.title || meta.i18nKey);
}

/** 页面 → 菜单行（字段齐全，缺的写 null —— 固定键序才不会有 git diff 噪声） */
function toMenuRow(page: ScannedPage): MenuRow {
  // 必须拷贝：`extractDefinePageFromCode` 的 `result.meta` 是扫描器缓存里的
  // 实时引用（`result.meta = parsed.meta`），直接改会污染后续读取
  const meta = { ...page.pageMeta?.meta };
  const menuType = menuTypeOf(meta);
  /** 目录与外链都不是路由：`routeName` 必须留空，否则 dev 校验会去找一条不存在的路由 */
  const isRoute = menuType !== 'directory' && menuType !== 'link';

  return {
    id: menuIdOf(page.name),
    parentId: meta.menuParent ? menuIdOf(meta.menuParent) : null,
    name: meta.title ?? page.name,
    code: snake(page.name),
    menuType,
    requiresAuth: meta.requiresAuth === false ? 'N' : 'Y',
    // 目录保留 `routePath`（子项前缀校验靠它），外链两者都不要。
    routeName: isRoute ? page.name : null,
    routePath: menuType === 'link' ? null : page.route,
    routeComponent: page.relativePath,
    order: meta.order ?? 999,
    icon: meta.icon ?? null,
    i18nKey: meta.i18nKey ?? null,
    keepAlive: page.cache === true ? 'Y' : 'N',
    multiTab: meta.multiTab ? 'Y' : 'N',
    pinned: meta.pinned ? 'Y' : 'N',
    href: optionalString(meta.href),
    iframeUrl: optionalString(meta.iframeUrl),
    routeLayout: null,
    routeRedirect: null,
    routeQueries: null,
    routeParams: null,
    description: null
  };
}

/** 按固定键序序列化（人工可比对，diff 稳定）；null 键不写，避免 44 行 ×6 个 null 的噪声 */
function stringify(rows: readonly MenuRow[]): string {
  const body = rows.map(row => {
    const entries = FIELD_ORDER.filter(key => row[key] !== undefined && row[key] !== null).map(
      key => `      ${JSON.stringify(key)}: ${JSON.stringify(row[key])}`
    );

    return `    {\n${entries.join(',\n')}\n    }`;
  });

  return `{\n  "$schema": "./menus.schema.json",\n  "menus": [\n${body.join(',\n')}\n  ]\n}\n`;
}

const MENUS_FILE = resolve(process.cwd(), 'src/menus/menus.json');

const scanOptions = { cwd: process.cwd(), srcDir: 'src', pagesDir: 'pages', ignore: ['**/modules/**'] };

type MenusFile = { menus?: MenuRow[] };

/** 读到的 JSON 顶层是个对象即可（条目字段的详细校验由 `pnpm lint` / 人手 review 兜底） */
function isMenusFile(value: unknown): value is MenusFile {
  return typeof value === 'object' && value !== null;
}

/** 一次对账的结果（纯数据，供调用方决定怎么报） */
export interface MenuSyncResult {
  pageCount: number;
  menuCount: number;
  /** 新增的 routeName */
  added: string[];
  /** 刷新的派生字段描述 */
  refreshed: string[];
  /** 菜单有但页面已不存在 */
  conflicted: string[];
}

/** 执行一次对账并写回 `src/menus/menus.json` 详见 docs/v3-notes.md N-393。 */
export async function syncMenus(): Promise<MenuSyncResult> {
  const scanned = await scanPages(scanOptions);
  const pages = scanned.pages.filter(isMenuPage);
  // 用 id 索引而非 routeName：目录类元数据页没有 routeName（它不是路由），
  // 而 id 对每个页面都确定（`menuIdOf(page.name)`）。
  const pageById = new Map(pages.map(page => [menuIdOf(page.name), page]));

  const raw: unknown = JSON.parse(readFileSync(MENUS_FILE, 'utf8'));
  const current: MenuRow[] = isMenusFile(raw) ? (raw.menus ?? []) : [];

  const added: string[] = [];
  const refreshed: string[] = [];
  const conflicted: string[] = [];

  // 已有条目：只刷新**派生自页面文件的**字段（路径/组件/三个开关），其余原样保留。
  // 这三个开关一样是页面 meta 的事实（`definePage({ cache })` / `meta.multiTab`），
  // 放 JSON 里只是为了让 seed 能把它们带进 DB —— 页面改了 JSON 就得跟上。
  const merged = current.map(row => {
    const page = pageById.get(String(row.id));

    if (!page) return row;

    const next: MenuRow = { ...row };
    const meta = page.pageMeta?.meta ?? {};
    const menuType = menuTypeOf(meta);
    const isRoute = menuType !== 'directory' && menuType !== 'link';
    const derived: Record<string, string | number | null> = {
      // 路径与组件始终跟页面走（外链没有路由）
      routePath: menuType === 'link' ? null : page.route,
      routeComponent: page.relativePath,
      routeName: isRoute ? page.name : null,
      keepAlive: page.cache === true ? 'Y' : 'N',
      multiTab: meta.multiTab ? 'Y' : 'N',
      pinned: meta.pinned ? 'Y' : 'N'
    };

    // 类型、外链地址、层级归属只在页面显式声明时接管：普通页面不声明 `menuType`，
    // 也就不会把人工在 JSON 里设的类型 / 外链地址擦掉。
    if (typeof meta.menuType === 'string') {
      derived.menuType = menuType;
      derived.href = optionalString(meta.href);
      derived.iframeUrl = optionalString(meta.iframeUrl);
    }
    if (meta.menuParent) derived.parentId = menuIdOf(meta.menuParent);

    for (const [key, value] of Object.entries(derived)) {
      // 缺键与 null 等价（写回时都会补 null），否则每次 sync 都会报告一遍「undefined → null」
      if ((next[key] ?? null) === value) continue;

      refreshed.push(`${String(row.id)}: ${key} ${String(next[key] ?? '')} → ${String(value ?? '')}`);
      next[key] = value;
    }

    return next;
  });

  const knownRouteNames = new Set(
    merged.map(row => row.routeName).filter((name): name is string => typeof name === 'string')
  );
  const seenIds = new Set(merged.map(row => String(row.id)));

  // 页面有、菜单没有 → 追加（order 留 999 待人工排）。
  // 两个维度都查：id（页面名的确定性函数）与 routeName（人工可能改过 id，
  // 这时只能靠 routeName 认出「这条菜单已经对应了该页面」）。
  for (const page of pages) {
    const id = menuIdOf(page.name);

    if (seenIds.has(id) || knownRouteNames.has(page.name)) continue;

    const row = toMenuRow(page);

    merged.push(row);
    if (typeof row.routeName === 'string') knownRouteNames.add(row.routeName);
    seenIds.add(id);
    added.push(page.name);
  }

  // 菜单有、页面没有 → 只警告（可能是页面临时下线，删不删由人定）。
  // 目录/外链/iframe 同样要查：它们的页面文件是 `.meta.ts` / `.reuse.ts`。
  for (const row of merged) {
    if (pageById.has(String(row.id))) continue;

    conflicted.push(
      `${typeof row.routeName === 'string' ? row.routeName : String(row.code)}${row.parentId ? `（父 ${String(row.parentId)}）` : ''}`
    );
  }

  // 固定键序 + 剔除 null 之外的意外键，写回（先写临时文件再 rename，避免中断留半个文件）
  const sorted = merged
    .map(row => {
      const uniform: MenuRow = {};

      for (const key of FIELD_ORDER) {
        uniform[key] = row[key] ?? null;
      }
      return uniform;
    })
    .sort((a, b) => Number(a.order ?? 999) - Number(b.order ?? 999) || String(a.id).localeCompare(String(b.id)));

  // 内容没变就不写：否则 P2 插件每次触发都刷 mtime，监听器反复空跑
  const next = stringify(sorted);

  if (next !== readFileSync(MENUS_FILE, 'utf8')) {
    writeFileSync(`${MENUS_FILE}.tmp`, next);
    renameSync(`${MENUS_FILE}.tmp`, MENUS_FILE);
  }

  return {
    pageCount: pages.length,
    menuCount: sorted.length,
    added,
    refreshed,
    conflicted
  };
}

/** 打印一次对账结果（CLI 与插件共用同一套措辞） */
export function reportMenuSync(result: MenuSyncResult): void {
  console.log(`[menu:sync] 页面 ${result.pageCount} 个，菜单 ${result.menuCount} 条`);

  if (result.added.length > 0)
    console.log(`  新增 ${result.added.length}：${result.added.join('、')}（order 待人工排）`);
  if (result.refreshed.length > 0)
    console.log(`  刷新派生字段 ${result.refreshed.length}：\n    ${result.refreshed.join('\n    ')}`);
  if (result.conflicted.length > 0)
    console.log(`  ⚠ 菜单有但页面已不存在 ${result.conflicted.length}：${result.conflicted.join('、')}`);
}

// 供 `node scripts/menu-sync.ts` 直接执行；被插件 import 时不进入 main
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  reportMenuSync(await syncMenus());
}
