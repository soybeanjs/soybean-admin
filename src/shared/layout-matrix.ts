/**
 * 「布局模式 × 配置项」矩阵（P2-20 PoC）。
 *
 * ## 为什么要有这个模块
 *
 * 主题抽屉的开关是**笛卡尔积**：6 种布局模式 × 19 个配置项 = 114 种组合，
 * 其中相当一部分在 Vean 里根本不生效（侧栏都没有时谈侧栏宽度毫无意义）。
 * 这些组合不会报错、不会崩，只会让某个开关**默默无反应**，typecheck / lint /
 * build / 视觉回归全绿。
 *
 * 所以把「哪些组合有效、生效值是什么、为什么无效」从 `SAppShell` 的隐式行为
 * 提成**显式的纯函数矩阵**：
 * - `resolveLayoutMatrix()` 是运行时真值（布局组件据此下发 props）；
 * - `describeLayoutMatrix()` 渲染成 Markdown 表（`docs/v3-task.md` 直接抄）。
 *
 * ## 事实来源（Vean 0.50 源码，改版即回归）
 *
 * - `packages/ui/src/components/app-shell/shared.ts` 的 `appShellSkeletons`：
 *   每个 `AppShellMode` 的 `orientation` / `sidebarVisible` / `collapsible` /
 *   `menuPlacement` / `logoPlacement` / `stableSidebar`。
 * - `app-shell.vue` 模板：`v-bind="layoutProps"` 在前，随后
 *   `:orientation` / `:sidebar-visible` / `:collapsible="skeleton.collapsible"`
 *   / `:sidebar-width` / `:collapsed-sidebar-width` 覆盖 ⇒ **本应用设置的
 *   `collapsible` 与 `variant`（header 菜单下的侧栏宽度）不生效**；
 *   `breadcrumbVisible` 另需 `menuPlacement==='sidebar' && logoPlacement==='sidebar'`。
 * - `app-shell.vue`：`isMobile` 时骨架固定为 `sidebar`，与 `mode` 无关。
 *
 * **版本哨兵**：`APP_SHELL_MATRIX_VERSION` 每次改动同步 bump；改动矩阵语义时
 * 同步更新 `describeLayoutMatrix()` 的断言基线（测试里会钉住版本号）。
 */
import type { AppShellMode, LayoutCollapsible, LayoutScrollBehavior, LayoutVariant } from '@vean/ui';
import { LAYOUT_MODES, MOBILE_DEGRADED_MODES, mapLayoutMode } from '@/constants/layout';
import type { LayoutModeName } from '@/constants/layout';
import type { TabVariant } from '@/constants/theme';

/** 矩阵语义版本：与 Vean 源码事实绑定，升级 Vean 时应 bump */
export const APP_SHELL_MATRIX_VERSION = '0.50.0-vean-app-shell-skeletons';

/**
 * 矩阵的列（配置项维度）。
 *
 * 顺序即文档表格顺序：**布局 → 尺寸 → 显隐 → 行为**。
 * 新增抽屉开关时在此登记，避免出现「只在面板里有、矩阵里查不到」的孤儿开关。
 */
export const MATRIX_DIMENSIONS = [
  // 布局形态
  'variant',
  'collapsible',
  'scrollBehavior',
  // 尺寸
  'sidebarWidth',
  'collapsedSidebarWidth',
  'mobileSidebarWidth',
  'headerHeight',
  'tabHeight',
  'footerHeight',
  // 显隐
  'headerVisible',
  'tabVisible',
  'footerVisible',
  'breadcrumbVisible',
  'triggerVisible',
  // 行为
  'fixedHeaderAndTab',
  'fixedFooter',
  'stretchFooter',
  'fullContent',
  'tabStyle'
] as const;

export type MatrixDimension = (typeof MATRIX_DIMENSIONS)[number];

/** 矩阵维度名 → i18n key（文档与抽屉共用同一套命名） */
export const MATRIX_DIMENSION_LABELS: Record<MatrixDimension, string> = {
  variant: 'theme.variant.title',
  collapsible: 'theme.collapsible.title',
  scrollBehavior: 'theme.scrollMode',
  sidebarWidth: 'theme.layout.sidebarWidth',
  collapsedSidebarWidth: 'theme.layout.collapsedSidebarWidth',
  mobileSidebarWidth: 'theme.layout.mobileSidebarWidth',
  headerHeight: 'theme.layout.headerHeight',
  tabHeight: 'theme.layout.tabHeight',
  footerHeight: 'theme.layout.footerHeight',
  headerVisible: 'theme.layout.headerVisible',
  tabVisible: 'theme.layout.tabVisible',
  footerVisible: 'theme.layout.footerVisible',
  breadcrumbVisible: 'theme.layout.breadcrumbVisible',
  triggerVisible: 'theme.layout.siderTrigger',
  fixedHeaderAndTab: 'theme.layout.fixedHeaderAndTab',
  fixedFooter: 'theme.layout.fixedFooter',
  stretchFooter: 'theme.layout.stretchFooter',
  fullContent: 'theme.layout.fullContent',
  tabStyle: 'theme.tab.variant'
};

/**
 * 单个壳模式的能力（= `appShellSkeletons` 的可观察后果）。
 *
 * 不用 `AppShellMode` 作 key 而用 `LayoutModeName`：能力随**应用**模式而非
 * shell 模式声明，一个 shell 模式只对应一个应用模式（`mapLayoutMode` 是单射），
 * 但这样新增应用模式时若忘了补能力表，`Record<...>` 会立刻报缺失键。
 */
interface ShellCapability {
  /** 该模式下布局是否存在侧栏（`skeleton.sidebarVisible`） */
  hasSidebar: boolean;
  /** 折叠形态：Vean 骨架强制值，应用设置不生效 */
  forcedCollapsible: LayoutCollapsible;
  /** 面包屑需要菜单与 logo 都在侧栏（`menuPlacement` + `logoPlacement`） */
  breadcrumbCapable: boolean;
  /** 折叠触发器（`showTrigger = triggerVisible && sidebarVisible`） */
  triggerCapable: boolean;
  /** 侧栏内容稳定不跳动（`stableSidebar`：宽度变化会推动 header） */
  stableSidebar: boolean;
  /** 侧栏宽度是否被列宽约束（`resolveShellWidths` 的列数推导） */
  sidebarWidthCapable: boolean;
}

const CAPABILITIES: Record<AppShellMode, ShellCapability> = {
  // 经典左菜单：一切开关都有意义
  sidebar: {
    hasSidebar: true,
    forcedCollapsible: 'icon',
    breadcrumbCapable: true,
    triggerCapable: true,
    stableSidebar: true,
    sidebarWidthCapable: true
  },
  // 双侧栏（竖向混合）：菜单/LOGO 在左栏，右栏是内容栏
  'dual-vertical': {
    hasSidebar: true,
    forcedCollapsible: 'icon',
    breadcrumbCapable: true,
    triggerCapable: true,
    stableSidebar: true,
    sidebarWidthCapable: true
  },
  // 顶栏菜单：无侧栏 —— 侧栏相关维度全部失效
  top: {
    hasSidebar: false,
    forcedCollapsible: 'icon',
    breadcrumbCapable: false,
    triggerCapable: false,
    stableSidebar: false,
    sidebarWidthCapable: false
  },
  // 顶栏 + 侧栏混合（侧栏优先）：LOGO 在顶栏 → 面包屑不渲染；折叠为抽屉式
  'vertical-horizontal': {
    hasSidebar: true,
    // 骨架强制 offcanvas：折叠是「抽屉式」，不是图标式
    forcedCollapsible: 'offcanvas',
    breadcrumbCapable: false,
    triggerCapable: true,
    stableSidebar: false,
    sidebarWidthCapable: true
  },
  // 顶栏 + 侧栏混合（顶栏优先）
  'horizontal-vertical': {
    hasSidebar: true,
    forcedCollapsible: 'icon',
    // 菜单在顶栏 → 面包屑不渲染
    breadcrumbCapable: false,
    triggerCapable: true,
    stableSidebar: false,
    sidebarWidthCapable: true
  },
  // 竖向混合 + 顶栏（顶栏 + 双列）
  'horizontal-dual-vertical': {
    hasSidebar: true,
    forcedCollapsible: 'icon',
    breadcrumbCapable: false,
    triggerCapable: true,
    stableSidebar: false,
    sidebarWidthCapable: true
  }
};

/** 矩阵输入：只收矩阵关心的字段，`ThemeSettings` 结构上满足即可 */
export interface LayoutMatrixInput {
  layoutMode: LayoutModeName;
  variant: LayoutVariant;
  collapsible: LayoutCollapsible;
  scrollBehavior: LayoutScrollBehavior;
  sidebarWidth: number;
  collapsedSidebarWidth: number;
  mobileSidebarWidth: number;
  headerHeight: number;
  tabHeight: number;
  footerHeight: number;
  headerVisible: boolean;
  tabVisible: boolean;
  footerVisible: boolean;
  breadcrumbVisible: boolean;
  triggerVisible: boolean;
  fixedHeaderAndTab: boolean;
  fixedFooter: boolean;
  stretchFooter: boolean;
  fullContent: boolean;
  tabStyle: TabVariant;
}

/** 矩阵运行上下文 */
export interface LayoutMatrixContext {
  /** <768px（与 SAppShell 同一断点） */
  isMobile: boolean;
  /**
   * 内容区是否自带滚动容器。
   *
   * `scrollBehavior: 'content'` 时页脚必须跟内容一起滚（否则页脚被固定在视口
   * 底部、内容从它下面穿过），Vean 用 `fixedFooter` 表达这个需求。
   */
  contentScroll?: boolean;
}

export type DimensionState = 'effective' | 'forced' | 'inert';

/**
 * 非生效态的原因分类。
 *
 * `degraded` 只把 `mode` 计入「该模式的固有限制」：
 * `user`（用户自己关的）与 `viewport`（桌面用不到移动端宽度）不该让抽屉报
 * 「当前模式不支持」。
 */
export type MatrixReason = 'mode' | 'viewport' | 'user' | 'dependency';

export interface DimensionCell {
  state: DimensionState;
  /** 生效/强制后的值（`inert` 时为 `null`） */
  value: number | boolean | string | null;
  /** 原因分类（`state === 'effective'` 时为 `null`） */
  reason: MatrixReason | null;
  /** 原因（一句话，`state !== 'effective'` 时必填） */
  note: string;
}

export interface LayoutMatrixRow {
  /** 应用布局模式（v2 名） */
  mode: LayoutModeName;
  /** 实际生效的壳模式（移动端降级为 `sidebar`） */
  shell: AppShellMode;
  /** 模式固有降级（有 `mode` 原因或 `forced` 格子）；不包含用户关掉的开关 */
  degraded: boolean;
  /** 移动端下该模式是否失去了原本的形态（<768px 退化为纯侧栏） */
  mobileDegraded: boolean;
  cells: Record<MatrixDimension, DimensionCell>;
  /**
   * 可直接 `v-bind` 到 `SAppShell` 的 props。
   *
   * 这是矩阵的**运行时效用**：`cells` 是给人看的诊断，`layoutProps` 是给壳的
   * 真值（已应用 forced 覆盖）。两者用同一批局部变量构建，不会走神。
   */
  layoutProps: LayoutMatrixProps;
}

/** `SAppShell` 的 `layoutProps` 面（已应用强制覆盖） */
export interface LayoutMatrixProps {
  variant: LayoutVariant;
  collapsible: LayoutCollapsible;
  scrollBehavior: LayoutScrollBehavior;
  sidebarWidth: number;
  collapsedSidebarWidth: number;
  mobileSidebarWidth: number;
  headerHeight: number;
  tabHeight: number;
  footerHeight: number;
  headerVisible: boolean;
  tabVisible: boolean;
  footerVisible: boolean;
  breadcrumbVisible: boolean;
  triggerVisible: boolean;
  fixedTop: boolean;
  fixedFooter: boolean;
  stretchFooter: boolean;
  fullContent: boolean;
}

/** 移动端壳模式：Vean 在 `isMobile` 时固定渲染 `sidebar` 骨架 */
const MOBILE_SHELL: AppShellMode = 'sidebar';

/** 构造非生效格子：state + 原因分类 + 一句话原因 */
function off(
  state: Exclude<DimensionState, 'effective'>,
  reason: MatrixReason,
  note: string,
  value: number | boolean | string | null = null
): DimensionCell {
  return { state, value, reason, note };
}

/** 构造生效格子。`note` 非空时是「为什么这样生效」的补充说明 */
function on(value: number | boolean | string | null, note = ''): DimensionCell {
  return { state: 'effective', value, reason: null, note };
}

/**
 * 核心：解一个「模式 × 配置项」组合。
 *
 * 纯函数，无 DOM / 无 store —— 所以能在 node 环境里跑矩阵全组合测试（P2-20）。
 */
export function resolveLayoutMatrix(input: LayoutMatrixInput, context: LayoutMatrixContext): LayoutMatrixRow {
  const { isMobile, contentScroll = false } = context;
  const shell: AppShellMode = isMobile ? MOBILE_SHELL : mapLayoutMode(input.layoutMode);
  const cap = CAPABILITIES[shell];
  const mobileNote = isMobile ? '（移动端骨架固定 sidebar）' : '';

  /** 移动端：侧栏变抽屉，宽侧栏语义失效，抽屉宽度才是真值 */
  const sidebarIsDrawer = isMobile;

  const collapsibleCell: DimensionCell =
    input.collapsible === cap.forcedCollapsible
      ? on(input.collapsible, `与骨架一致${mobileNote}`)
      : off(
          'forced',
          'mode',
          `骨架强制为 ${cap.forcedCollapsible}${mobileNote}，应用设置被覆盖`,
          cap.forcedCollapsible
        );

  const scrollCell: DimensionCell =
    input.scrollBehavior === 'content'
      ? on('content', contentScroll ? '内容区滚动，页脚随内容滚动' : '内容区滚动，建议关闭 fixedFooter')
      : on('wrapper', 'wrapper 滚动，页脚由布局固定');

  const sidebarWidthCell = sidebarIsDrawer
    ? off('inert', 'viewport', '移动端侧栏为抽屉，宽侧栏不生效（见 mobileSidebarWidth）')
    : cap.sidebarWidthCapable
      ? on(input.sidebarWidth, cap.stableSidebar ? '列宽稳定，直接生效' : '列宽随内容浮动，仍按此设宽')
      : off('inert', 'mode', '顶栏菜单模式无侧栏');

  const collapsedWidthCell = sidebarIsDrawer
    ? off('inert', 'viewport', '移动端侧栏为抽屉，无「图标折叠态」')
    : !cap.sidebarWidthCapable
      ? off('inert', 'mode', '顶栏菜单模式无侧栏')
      : cap.forcedCollapsible === 'icon' && input.collapsible === 'icon'
        ? on(input.collapsedSidebarWidth, '仅在 icon 折叠态生效')
        : off('inert', 'mode', `骨架折叠形态为 ${cap.forcedCollapsible}，无图标折叠态，该宽度不参与布局`);

  const headerHeightCell = input.headerVisible ? on(input.headerHeight) : off('inert', 'user', '头部不可见，高度无效');

  const tabHeightCell = input.tabVisible ? on(input.tabHeight) : off('inert', 'user', '页签不可见，高度无效');

  const footerHeightCell = input.footerVisible ? on(input.footerHeight) : off('inert', 'user', '页脚不可见，高度无效');

  const fixedTopCell =
    isMobile || !input.headerVisible
      ? off('inert', isMobile ? 'viewport' : 'user', isMobile ? '移动端头部随内容滚动' : '头部不可见，吸顶无意义')
      : on(input.fixedHeaderAndTab);

  const fixedFooterCell = !input.footerVisible
    ? off('inert', 'user', '页脚不可见，吸底无意义')
    : input.scrollBehavior === 'content' && !contentScroll
      ? off('forced', 'dependency', '内容滚动时吸底页脚会遮住内容，已降级为 false', false)
      : on(input.fixedFooter);

  const stretchFooterCell = input.footerVisible
    ? on(input.stretchFooter, '仅影响页脚宽度是否跟随内容区')
    : off('inert', 'user', '页脚不可见');

  const tabStyleCell = input.tabVisible
    ? on(input.tabStyle, '经 #tabs 槽下发 SPageTabs variant')
    : off('inert', 'user', '页签不可见');

  const breadcrumbCell = !input.breadcrumbVisible
    ? off('inert', 'user', '用户已关闭面包屑')
    : cap.breadcrumbCapable
      ? on(true)
      : off('inert', 'mode', '该模式面包屑不可见（菜单或 LOGO 不在侧栏）');

  const triggerCell = !cap.hasSidebar
    ? off('inert', 'mode', '该模式无侧栏，折叠触发器不渲染')
    : input.triggerVisible
      ? on(true)
      : off('inert', 'user', '用户已关闭折叠触发器');

  const variantCell = cap.hasSidebar
    ? on(input.variant, `data-variant=${input.variant}`)
    : off('inert', 'mode', '顶栏菜单模式无侧栏，variant 不影响布局');

  const mobileSidebarWidthCell = isMobile
    ? on(input.mobileSidebarWidth, '移动端抽屉宽度')
    : off('inert', 'viewport', '仅移动端生效');

  const cells: Record<MatrixDimension, DimensionCell> = {
    variant: variantCell,
    collapsible: collapsibleCell,
    scrollBehavior: scrollCell,
    sidebarWidth: sidebarWidthCell,
    collapsedSidebarWidth: collapsedWidthCell,
    mobileSidebarWidth: mobileSidebarWidthCell,
    headerHeight: headerHeightCell,
    tabHeight: tabHeightCell,
    footerHeight: footerHeightCell,
    headerVisible: on(input.headerVisible),
    tabVisible: on(input.tabVisible),
    footerVisible: on(input.footerVisible),
    breadcrumbVisible: breadcrumbCell,
    triggerVisible: triggerCell,
    fixedHeaderAndTab: fixedTopCell,
    fixedFooter: fixedFooterCell,
    stretchFooter: stretchFooterCell,
    fullContent: on(input.fullContent, fullContentNote(input, cap)),
    tabStyle: tabStyleCell
  };

  /** 只把模式固有降级（`mode`）计作 degraded；用户关掉的开关与视口差异不算 */
  const degraded = Object.values(cells).some(item => item.state === 'forced' || item.reason === 'mode');

  const layoutProps: LayoutMatrixProps = {
    // 骨架会覆盖 collapsible（`:collapsible="skeleton.collapsible"`），这里下发的
    // 是骨架值本身，壳内外一致；variant 没有骨架覆盖，按设置下发
    variant: input.variant,
    collapsible: cap.forcedCollapsible,
    scrollBehavior: input.scrollBehavior,
    sidebarWidth: input.sidebarWidth,
    collapsedSidebarWidth: input.collapsedSidebarWidth,
    mobileSidebarWidth: input.mobileSidebarWidth,
    headerHeight: input.headerHeight,
    tabHeight: input.tabHeight,
    footerHeight: input.footerHeight,
    headerVisible: input.headerVisible,
    tabVisible: input.tabVisible,
    footerVisible: input.footerVisible,
    // 面包屑/触发器即使被设置为可见，模式不支持时也不下发 true（避免壳内部再判一次）
    breadcrumbVisible: input.breadcrumbVisible && cap.breadcrumbCapable,
    triggerVisible: input.triggerVisible && cap.hasSidebar,
    fixedTop: input.fixedHeaderAndTab && input.headerVisible && !isMobile,
    // 与 fixedFooterCell 同一条件：内容滚动且未声明滚动容器时吸底页脚会遮住内容
    fixedFooter: input.footerVisible && (input.scrollBehavior !== 'content' || contentScroll) && input.fixedFooter,
    stretchFooter: input.stretchFooter,
    fullContent: input.fullContent
  };

  return {
    mode: input.layoutMode,
    shell,
    degraded,
    mobileDegraded: isMobile && MOBILE_DEGRADED_MODES.has(input.layoutMode),
    cells,
    layoutProps
  };
}

function fullContentNote(input: LayoutMatrixInput, cap: ShellCapability): string {
  if (!input.fullContent) return '';

  return cap.hasSidebar
    ? '全屏内容：头部/页签/面包屑/页脚均被隐藏，侧栏保留'
    : '全屏内容：头部/页签/面包屑/页脚均被隐藏';
}

/**
 * 渲染 Markdown 表（6 模式 × 19 维），供 `docs/v3-task.md` 直接引用。
 *
 * 单元格记号：`✅` 生效 / `🔒` 被骨架覆盖（forced）/ `—` 失效（inert）。
 */
export function describeLayoutMatrix(
  input: LayoutMatrixInput,
  context: LayoutMatrixContext = { isMobile: false }
): string {
  const MARK: Record<DimensionState, string> = { effective: '✅', forced: '🔒', inert: '—' };
  const header = ['维度', ...LAYOUT_MODES.map(mode => mode.value)];
  const lines = [
    `<!-- ${APP_SHELL_MATRIX_VERSION} -->`,
    `| ${header.join(' | ')} |`,
    `| ${header.map(() => '---').join(' | ')} |`
  ];

  for (const dimension of MATRIX_DIMENSIONS) {
    const cells = LAYOUT_MODES.map(mode => {
      const row = resolveLayoutMatrix({ ...input, layoutMode: mode.value }, context);
      const item = row.cells[dimension];
      return `${MARK[item.state]} ${String(item.value ?? '—')}`;
    });

    lines.push(`| \`${dimension}\` | ${cells.join(' | ')} |`);
  }

  return lines.join('\n');
}

/** `effective` 视作未降级时，布尔维度的真值（供抽屉提示层使用） */
export function isCellEffective(item: DimensionCell): boolean {
  return item.state === 'effective';
}
