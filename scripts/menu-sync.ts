import { readFileSync, renameSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { ScannedPage } from '@ubean/scan';
import { scanPages } from '@ubean/vue/vite';

/**
 * `pnpm menu:sync` —— 用页面文件补齐 `src/menus/menus.json`（文档 §5 的 P1）。
 *
 * 菜单源数据是人写的（层级、标题、图标、排序都是审美决定），但「哪些页面
 * 存在、路径是什么」是机器事实。本脚本只做这两件事之间的对账：
 *
 * - **新增**：页面有 `definePage` 标题却不在菜单里 → 追加一行（`order` 留
 *   `DEFAULT_ORDER` 待人工排）。
 * - **刷新派生字段**：`routePath` / `routeComponent` 从页面文件重算。这两个
 *   必须与文件系统一致，否则 `router.push` 跳错页 —— 所以它们不接受人工覆盖。
 * - **绝不改**：已有条目的 `name` / `icon` / `i18nKey` / `order` / `parentId` /
 *   各开关，一个字段都不动。
 * - **绝不删**：路由消失的条目只打警告并列出来，由人决定删还是留（可能是
 *   页面临时下线）。
 *
 * 「页面是否该进菜单」的判据（`hideInMenu` / `blank` 布局 / `requiresAuth: false`
 * / 无标题）在 `src/store/modules/menu/shared.ts` 与这里各有一份，两者必须一致 ——
 * 前者管运行时，后者管生成期。**不抽公共模块是刻意的**：本脚本要能被普通
 * `node` 直接执行，而 `@/` 别名模块（`@/schema/menu` 等）在 Vite 之外解析不了，
 * 抽出去就得多加一层构建步骤，不值得。
 *
 * 为什么不写机器产物 `_generated.json`（文档 §5.1 约束②）：那条约束要防的是
 * 「单文件双写导致人工字段被覆盖」。这里已经用「只写派生字段 + 只追加」把风险
 * 消掉了，多一个文件反而让「菜单到底在哪」变成两个地方。
 *
 * 运行方式：`node scripts/menu-sync.ts`（Node 原生 TS，无需构建）。因此**不能
 * import `@/` 别名模块** —— 下面的 `snake` 与字段清单是本脚本自带的副本。
 */

/**
 * 与 `src/store/modules/menu/shared.ts` 的 `AppMenu` 对齐的字段顺序。
 *
 * 覆盖 `src/db/schema/menu.ts` 的全部列（除 `enabled` —— 那是 DB 的运行时状态，
 * 不该由菜单源文件管），这样手写的 `routeRedirect` / `routeQueries` / `description`
 * 等可选字段也能安全回写，不会被本脚本砍掉。
 */
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

  return {
    id: menuIdOf(page.name),
    parentId: meta.menuParent ? menuIdOf(meta.menuParent) : null,
    name: meta.title ?? page.name,
    code: snake(page.name),
    menuType: 'menu',
    requiresAuth: meta.requiresAuth === false ? 'N' : 'Y',
    routeName: page.name,
    routePath: page.route,
    routeComponent: page.relativePath,
    order: meta.order ?? 999,
    icon: meta.icon ?? null,
    i18nKey: meta.i18nKey ?? null,
    keepAlive: page.cache === true ? 'Y' : 'N',
    multiTab: meta.multiTab ? 'Y' : 'N',
    pinned: meta.pinned ? 'Y' : 'N',
    href: null,
    iframeUrl: null,
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
const scanned = await scanPages(scanOptions);

const pages = scanned.pages.filter(isMenuPage);
const pageByRouteName = new Map(pages.map(page => [page.name, page]));

type MenusFile = { menus?: MenuRow[] };

/** 读到的 JSON 顶层是个对象即可（条目字段的详细校验由 `pnpm lint` / 人手 review 兜底） */
function isMenusFile(value: unknown): value is MenusFile {
  return typeof value === 'object' && value !== null;
}

const raw: unknown = JSON.parse(readFileSync(MENUS_FILE, 'utf8'));
const current: MenuRow[] = isMenusFile(raw) ? (raw.menus ?? []) : [];

const added: string[] = [];
const refreshed: string[] = [];
const conflicted: string[] = [];

// 已有条目：只刷新**派生自页面文件的**字段（路径/组件/三个开关），其余原样保留。
// 这三个开关一样是页面 meta 的事实（`definePage({ cache })` / `meta.multiTab`），
// 放 JSON 里只是为了让 seed 能把它们带进 DB —— 页面改了 JSON 就得跟上。
const merged = current.map(row => {
  const routeName = row.routeName;

  if (typeof routeName !== 'string') return row;

  const page = pageByRouteName.get(routeName);

  if (!page) return row;

  const next: MenuRow = { ...row };
  const derived: Record<string, string> = {
    routePath: page.route,
    routeComponent: page.relativePath,
    keepAlive: page.cache === true ? 'Y' : 'N'
  };
  const meta = page.pageMeta?.meta ?? {};

  derived.multiTab = meta.multiTab ? 'Y' : 'N';
  derived.pinned = meta.pinned ? 'Y' : 'N';

  for (const [key, value] of Object.entries(derived)) {
    if (next[key] === value) continue;

    refreshed.push(`${routeName}: ${key} ${String(next[key] ?? '')} → ${value}`);
    next[key] = value;
  }

  return next;
});

const knownRouteNames = new Set(
  merged.map(row => row.routeName).filter((name): name is string => typeof name === 'string')
);

// 页面有、菜单没有 → 追加（order 留 999 待人工排）。
// 追加时立即登记 routeName 与 id：两个页面撞名（重名 id）时后者会被跳过并告警，
// 否则会写出重复 id 的菜单行，建树时静默丢一个。
const seenIds = new Set(merged.map(row => String(row.id)));

for (const page of pages) {
  if (knownRouteNames.has(page.name)) continue;

  const row = toMenuRow(page);

  if (seenIds.has(String(row.id))) {
    conflicted.push(`${page.name}（id ${String(row.id)} 已被占用，未追加）`);
    continue;
  }

  merged.push(row);
  knownRouteNames.add(page.name);
  seenIds.add(String(row.id));
  added.push(page.name);
}

// 菜单有、页面没有 → 只警告（可能是页面临时下线，删不删由人定）
for (const row of merged) {
  const routeName = row.routeName;

  if (typeof routeName !== 'string') continue;
  if (pageByRouteName.has(routeName)) continue;

  conflicted.push(`${routeName}${row.parentId ? `（父 ${String(row.parentId)}）` : ''}`);
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

writeFileSync(`${MENUS_FILE}.tmp`, stringify(sorted));
renameSync(`${MENUS_FILE}.tmp`, MENUS_FILE);

console.log(`[menu:sync] 页面 ${pages.length} 个，菜单 ${sorted.length} 条`);
if (added.length > 0) console.log(`  新增 ${added.length}：${added.join('、')}（order 待人工排）`);
if (refreshed.length > 0) console.log(`  刷新派生字段 ${refreshed.length}：\n    ${refreshed.join('\n    ')}`);
if (conflicted.length > 0) console.log(`  ⚠ 菜单有但页面已不存在 ${conflicted.length}：${conflicted.join('、')}`);
