/**
 * 布局模式（v2 语义名）与 Vean 壳模式的映射（P2-01 / P2-20）。
 *
 * 放在 `constants/` 而不是 theme store：`src/shared/layout-matrix.ts` 与
 * `src/components/theme-drawer/**` 都要读这张表，它们不该为此把 pinia store
 * 拖进依赖图。theme store 仍 re-export（`LAYOUT_MODES` / `mapLayoutMode` /
 * `LayoutModeName`），旧引用不必改。
 */
import type { AppShellMode } from '@vean/ui';

/**
 * key 用 v2 命名（`vertical` / `horizontal` / …），`shell` 是 `@vean/ui` 的
 * `AppShellMode`（6 模式）。菜单、持久化与 i18n 都用 v2 名（与 v3-task 表述
 * 一致），传给 `SAppShell` 前经 `mapLayoutMode()` 翻译。
 *
 * `mobile` 标记该模式在 <768px 下是否需要退化为纯侧栏（Vean 的
 * `app-shell.vue` 在移动端本来就固定渲染 `sidebar` 骨架，见
 * `resolveShellCapabilities()`：矩阵把这件事显式化，而不是靠隐式副作用）。
 */
export const LAYOUT_MODES = [
  { value: 'vertical', label: 'theme.layoutMode.vertical', shell: 'sidebar', mobile: 'native' },
  { value: 'vertical-mix', label: 'theme.layoutMode.verticalMix', shell: 'dual-vertical', mobile: 'degrade' },
  { value: 'horizontal', label: 'theme.layoutMode.horizontal', shell: 'top', mobile: 'degrade' },
  {
    value: 'top-hybrid-sidebar-first',
    label: 'theme.layoutMode.topHybridSidebarFirst',
    shell: 'vertical-horizontal',
    mobile: 'degrade'
  },
  {
    value: 'top-hybrid-header-first',
    label: 'theme.layoutMode.topHybridHeaderFirst',
    shell: 'horizontal-vertical',
    mobile: 'degrade'
  },
  {
    value: 'vertical-hybrid-header-first',
    label: 'theme.layoutMode.verticalHybridHeaderFirst',
    shell: 'horizontal-dual-vertical',
    mobile: 'degrade'
  }
] as const;

export type LayoutModeName = (typeof LAYOUT_MODES)[number]['value'];

/** v2 布局模式名 → SAppShell 模式 */
export function mapLayoutMode(name: LayoutModeName): AppShellMode {
  return LAYOUT_MODES.find(item => item.value === name)!.shell;
}

/** 移动端（<768px）下需退化为纯侧栏的模式集合（P2-13） */
export const MOBILE_DEGRADED_MODES: ReadonlySet<LayoutModeName> = new Set<LayoutModeName>(
  LAYOUT_MODES.filter(item => item.mobile === 'degrade').map(item => item.value)
);
