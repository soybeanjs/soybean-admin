/** 布局模式（v2 语义名）与 Vean 壳模式的映射（P2-01 / P2-20） 详见 docs/v3-notes.md N-278。 */
import type { AppShellMode } from '@vean/ui';

/** key 用 v2 命名（`vertical` / `horizontal` / …），`shell` 是 `@vean/ui` 的 详见 docs/v3-notes.md N-279。 */
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
