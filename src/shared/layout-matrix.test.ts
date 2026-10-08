import { describe, expect, it } from 'vitest';
import { LAYOUT_MODES, MOBILE_DEGRADED_MODES } from '@/constants/layout';
import type { LayoutModeName } from '@/constants/layout';
import {
  APP_SHELL_MATRIX_VERSION,
  MATRIX_DIMENSIONS,
  describeLayoutMatrix,
  isCellEffective,
  resolveLayoutMatrix
} from './layout-matrix';
import type { LayoutMatrixInput } from './layout-matrix';

/**
 * P2-20：布局模式 × 配置项矩阵的守卫。
 *
 * 这里的断言全部来自 Vean 源码事实（`appShellSkeletons`、`app-shell.vue` 模板的
 * 覆盖顺序、`showBreadcrumb` / `showTrigger` 的条件），而不是「跑起来看着对」。
 * 原因：这些组合失效时**不报错**——只是某个开关默默无反应，视觉回归和 CI 全绿。
 */

const ALL_MODES = LAYOUT_MODES.map(item => item.value);

function baseInput(overrides: Partial<LayoutMatrixInput> = {}): LayoutMatrixInput {
  return {
    layoutMode: 'vertical',
    variant: 'sidebar',
    collapsible: 'icon',
    scrollBehavior: 'wrapper',
    sidebarWidth: 240,
    collapsedSidebarWidth: 50,
    mobileSidebarWidth: 260,
    headerHeight: 56,
    tabHeight: 44,
    footerHeight: 48,
    headerVisible: true,
    tabVisible: true,
    footerVisible: true,
    breadcrumbVisible: true,
    triggerVisible: true,
    fixedHeaderAndTab: true,
    fixedFooter: true,
    stretchFooter: false,
    fullContent: false,
    tabStyle: 'chrome',
    ...overrides
  };
}

describe('布局矩阵 · 结构不变量', () => {
  it('矩阵事实锚定在已核对的 Vean 版本上（升级 Vean 需复核）', () => {
    expect(APP_SHELL_MATRIX_VERSION).toBe('0.50.0-vean-app-shell-skeletons');
  });

  it('6 种应用模式一一映射到 6 个壳模式，无重复', () => {
    const shells = ALL_MODES.map(
      mode => resolveLayoutMatrix(baseInput({ layoutMode: mode }), { isMobile: false }).shell
    );

    expect(shells).toHaveLength(6);
    expect(new Set(shells).size).toBe(6);
  });

  it('每种模式 × 每个维度都有格子，非 effective 的格子必须给出原因', () => {
    for (const mode of ALL_MODES) {
      const row = resolveLayoutMatrix(baseInput({ layoutMode: mode }), { isMobile: false });

      for (const dimension of MATRIX_DIMENSIONS) {
        const item = row.cells[dimension];

        expect(item, `${mode}/${dimension}`).toBeDefined();
        if (item.state === 'effective') {
          expect(item.value, `${mode}/${dimension} 生效时必须有值`).not.toBeNull();
        } else {
          expect(item.reason, `${mode}/${dimension} 非生效态必须有原因分类`).not.toBeNull();
          expect(item.note, `${mode}/${dimension} 非生效态必须解释原因`).not.toBe('');
        }
      }
    }
  });

  it('降级标记与格子状态一致（抽屉据此提示用户）', () => {
    for (const mode of ALL_MODES) {
      const row = resolveLayoutMatrix(baseInput({ layoutMode: mode }), { isMobile: false });
      const modish = Object.values(row.cells).filter(item => item.state === 'forced' || item.reason === 'mode');

      expect(row.degraded, mode).toBe(modish.length > 0);
      expect(isCellEffective(row.cells.tabStyle)).toBe(true);
    }
  });

  it('降级标记只计模式固有降级，不计用户开关与视口差异', () => {
    // 桌面端的 mobileSidebarWidth 恒为 inert(viewport)：不该让 vertical 被判为降级
    const desktop = resolveLayoutMatrix(baseInput({ layoutMode: 'vertical' }), { isMobile: false });

    expect(desktop.cells.mobileSidebarWidth.state).toBe('inert');
    expect(desktop.cells.mobileSidebarWidth.reason).toBe('viewport');
    expect(desktop.degraded).toBe(false);

    const userOff = resolveLayoutMatrix(baseInput({ layoutMode: 'vertical', tabVisible: false }), {
      isMobile: false
    });

    expect(userOff.cells.tabStyle.reason).toBe('user');
    expect(userOff.degraded).toBe(false);
  });

  it('模式降级只发生在「骨架与设置冲突」或「该维度不存在」的模式上', () => {
    const degradedModes = ALL_MODES.filter(
      mode => resolveLayoutMatrix(baseInput({ layoutMode: mode }), { isMobile: false }).degraded
    );

    // vertical / vertical-mix 的骨架与设置完全一致（icon 折叠 + 侧栏菜单 + 侧栏 LOGO）
    expect(degradedModes).toEqual<LayoutModeName[]>([
      'horizontal',
      'top-hybrid-sidebar-first',
      'top-hybrid-header-first',
      'vertical-hybrid-header-first'
    ]);
  });

  it('forced 格子必须给出强制后的值（抽屉要展示真值）', () => {
    const row = resolveLayoutMatrix(baseInput({ layoutMode: 'top-hybrid-sidebar-first' }), { isMobile: false });

    for (const dimension of MATRIX_DIMENSIONS) {
      const item = row.cells[dimension];

      if (item.state === 'forced') {
        expect(item.reason, dimension).toBe('mode');
        expect(item.value, dimension).not.toBeNull();
      }
    }
  });
});

describe('布局矩阵 · 模式相关的事实', () => {
  it('顶栏菜单模式（horizontal）没有侧栏：宽度/折叠/触发器/面包屑全部失效', () => {
    const row = resolveLayoutMatrix(baseInput({ layoutMode: 'horizontal' }), { isMobile: false });

    expect(row.shell).toBe('top');
    expect(row.cells.sidebarWidth.state).toBe('inert');
    expect(row.cells.collapsedSidebarWidth.state).toBe('inert');
    expect(row.cells.triggerVisible.state).toBe('inert');
    expect(row.cells.breadcrumbVisible.state).toBe('inert');
    expect(row.cells.variant.state).toBe('inert');
    expect(row.degraded).toBe(true);
  });

  it('菜单在顶栏的混合模式面包屑不渲染（menuPlacement/logoPlacement 不在 sidebar）', () => {
    const breadcrumbModes = ALL_MODES.filter(mode => {
      const row = resolveLayoutMatrix(baseInput({ layoutMode: mode }), { isMobile: false });
      return row.cells.breadcrumbVisible.state === 'effective';
    });

    expect(breadcrumbModes).toEqual<LayoutModeName[]>(['vertical', 'vertical-mix']);
  });

  it('应用设置的 collapsible 被骨架覆盖，并给出强制值', () => {
    // vertical-horizontal（top-hybrid-sidebar-first）骨架强制 offcanvas：
    // 抽屉里选 icon 会被覆盖，折叠宽度随之失效
    const row = resolveLayoutMatrix(baseInput({ layoutMode: 'top-hybrid-sidebar-first' }), { isMobile: false });

    expect(row.shell).toBe('vertical-horizontal');
    expect(row.cells.collapsible.state).toBe('forced');
    expect(row.cells.collapsible.value).toBe('offcanvas');
    expect(row.cells.collapsedSidebarWidth.state).toBe('inert');

    // 与骨架给的值一致时不算降级
    const aligned = resolveLayoutMatrix(
      baseInput({ layoutMode: 'top-hybrid-sidebar-first', collapsible: 'offcanvas' }),
      { isMobile: false }
    );

    expect(aligned.cells.collapsible.state).toBe('effective');
  });

  it('折叠宽度仅在 icon 折叠态有效', () => {
    const icon = resolveLayoutMatrix(baseInput({ collapsible: 'icon' }), { isMobile: false });
    const offcanvas = resolveLayoutMatrix(baseInput({ collapsible: 'offcanvas' }), { isMobile: false });

    expect(icon.cells.collapsedSidebarWidth.state).toBe('effective');
    expect(offcanvas.cells.collapsedSidebarWidth.state).toBe('inert');
  });
});

describe('布局矩阵 · 与视口/开关的交叉', () => {
  it('移动端固定降级为 sidebar 骨架，桌面模式只影响 mode 字段', () => {
    for (const mode of ALL_MODES) {
      const row = resolveLayoutMatrix(baseInput({ layoutMode: mode }), { isMobile: true });

      expect(row.mode, mode).toBe(mode);
      expect(row.shell, mode).toBe('sidebar');
      expect(row.cells.mobileSidebarWidth.state).toBe('effective');
      expect(row.cells.sidebarWidth.state).toBe('inert');
      expect(row.cells.collapsedSidebarWidth.state).toBe('inert');
      expect(row.cells.fixedHeaderAndTab.state).toBe('inert');
    }
  });

  it('移动端需要退化的模式集合与 LAYOUT_MODES 标记一致', () => {
    for (const mode of ALL_MODES) {
      const row = resolveLayoutMatrix(baseInput({ layoutMode: mode }), { isMobile: true });
      const collapsed = row.shell !== resolveLayoutMatrix(baseInput({ layoutMode: mode }), { isMobile: false }).shell;

      expect(collapsed, mode).toBe(MOBILE_DEGRADED_MODES.has(mode));
    }
  });

  it('头部/页签/页脚不可见时，高度与吸顶/撑满维度全部失效', () => {
    const row = resolveLayoutMatrix(baseInput({ headerVisible: false, tabVisible: false, footerVisible: false }), {
      isMobile: false
    });

    for (const dimension of [
      'headerHeight',
      'tabHeight',
      'footerHeight',
      'fixedHeaderAndTab',
      'fixedFooter',
      'stretchFooter',
      'tabStyle'
    ] as const) {
      expect(row.cells[dimension].state, dimension).toBe('inert');
    }
  });

  it('内容滚动且未声明内容滚动容器时，吸底页脚被强制为 false', () => {
    const undeclared = resolveLayoutMatrix(baseInput({ scrollBehavior: 'content' }), { isMobile: false });
    const declared = resolveLayoutMatrix(baseInput({ scrollBehavior: 'content' }), {
      isMobile: false,
      contentScroll: true
    });

    expect(undeclared.cells.fixedFooter.state).toBe('forced');
    expect(undeclared.cells.fixedFooter.reason).toBe('dependency');
    expect(undeclared.cells.fixedFooter.value).toBe(false);
    expect(declared.cells.fixedFooter.state).toBe('effective');
    expect(declared.cells.fixedFooter.value).toBe(true);
  });

  it('用户主动关闭的维度记为 inert 而不是 forced（不是被框架改写）', () => {
    const row = resolveLayoutMatrix(baseInput({ breadcrumbVisible: false, triggerVisible: false, fullContent: true }), {
      isMobile: false
    });

    expect(row.cells.breadcrumbVisible.state).toBe('inert');
    expect(row.cells.breadcrumbVisible.note).toContain('用户已关闭');
    expect(row.cells.triggerVisible.state).toBe('inert');
    expect(row.cells.fullContent.value).toBe(true);
    expect(row.cells.fullContent.note).not.toBe('');
  });
});

describe('布局矩阵 · 下发给 SAppShell 的 props', () => {
  it('sidebar 模式原样透传用户设置（矩阵不制造无谓差异）', () => {
    const { layoutProps } = resolveLayoutMatrix(baseInput(), { isMobile: false });

    expect(layoutProps.collapsible).toBe('icon');
    expect(layoutProps.breadcrumbVisible).toBe(true);
    expect(layoutProps.triggerVisible).toBe(true);
    expect(layoutProps.fixedTop).toBe(true);
    expect(layoutProps.fixedFooter).toBe(true);
  });

  it('top 模式没有侧栏：面包屑与折叠触发器被压成 false（而不是留给组件静默忽略）', () => {
    const { layoutProps } = resolveLayoutMatrix(baseInput({ layoutMode: 'horizontal' }), { isMobile: false });

    expect(layoutProps.breadcrumbVisible).toBe(false);
    expect(layoutProps.triggerVisible).toBe(false);
  });

  it('top-hybrid-sidebar-first 的折叠态只能是 offcanvas（骨架强制，app 层改不动）', () => {
    const { layoutProps } = resolveLayoutMatrix(baseInput({ layoutMode: 'top-hybrid-sidebar-first' }), {
      isMobile: false
    });

    expect(layoutProps.collapsible).toBe('offcanvas');
  });

  it('移动端固定头部失效（壳固定渲染 sidebar 骨架，固定头部让位给抽屉滚动）', () => {
    const { layoutProps } = resolveLayoutMatrix(baseInput(), { isMobile: true });

    expect(layoutProps.fixedTop).toBe(false);
  });

  it('头部/页脚隐藏或内容滚动时，对应的吸顶吸底被压成 false', () => {
    const noHeader = resolveLayoutMatrix(baseInput({ headerVisible: false }), { isMobile: false });
    const noFooter = resolveLayoutMatrix(baseInput({ footerVisible: false }), { isMobile: false });
    const contentScroll = resolveLayoutMatrix(baseInput({ scrollBehavior: 'content' }), { isMobile: false });

    expect(noHeader.layoutProps.fixedTop).toBe(false);
    expect(noFooter.layoutProps.fixedFooter).toBe(false);
    expect(contentScroll.layoutProps.fixedFooter).toBe(false);
  });
});

describe('布局矩阵 · 移动端降级标记', () => {
  it('移动端只标记「表现与配置不一致」的模式（桌面模式在移动端被换成 sidebar 骨架）', () => {
    const degraded = ALL_MODES.filter(
      mode => resolveLayoutMatrix(baseInput({ layoutMode: mode }), { isMobile: true }).mobileDegraded
    );

    expect(degraded).toEqual([...MOBILE_DEGRADED_MODES]);
  });

  it('桌面端不做降级标记；移动端一律渲染 sidebar 骨架并单独标记 mobileDegraded', () => {
    const desktop = resolveLayoutMatrix(baseInput({ layoutMode: 'horizontal' }), { isMobile: false });
    const mobile = resolveLayoutMatrix(baseInput({ layoutMode: 'horizontal' }), { isMobile: true });

    expect(desktop.mobileDegraded).toBe(false);
    expect(mobile.shell).toBe('sidebar');
    expect(mobile.mobileDegraded).toBe(true);
    // 移动端下 sidebar 骨架全能力，没有任何维度被「强制改写」，所以 degraded 仍为 false
    expect(mobile.degraded).toBe(false);
  });
});

describe('布局矩阵 · 文档渲染', () => {
  it('Markdown 表覆盖全部维度与模式，且带 Vean 版本哨兵', () => {
    const table = describeLayoutMatrix(baseInput());

    expect(table).toContain(APP_SHELL_MATRIX_VERSION);
    expect(table.split('\n').filter(line => line.startsWith('|'))).toHaveLength(MATRIX_DIMENSIONS.length + 2);
    for (const dimension of MATRIX_DIMENSIONS) {
      expect(table, dimension).toContain(`\`${dimension}\``);
    }
  });
});
