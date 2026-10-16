// @unocss-include 详见 docs/v3-notes.md N-045。

import { computed } from 'vue';
import type { WritableComputedRef } from 'vue';
import type { ClassValue } from '@vean/ui';
import { WATERMARK_TIME_FORMATS } from '@/constants/theme';
import type { WatermarkTimeFormat } from '@/constants/theme';
import { useThemeStore } from '@/store/modules/theme';
import type { LayoutModeName, ThemeSettings } from '@/store/modules/theme';

/** 下拉/分段控件的选项（`label` 已由调用方 `t()` 解析成文案） */
export interface ThemeOptionItem<T extends ThemeOptionValue = ThemeOptionValue> {
  value: T;
  label: string;
  disabled?: boolean;
}

/** `OptionRow` 的 value 联合：下拉 emit 的是宽的 `DefinedValue` */
export type ThemeOptionValue = string | number;

/** 行容器统一样式：两端对齐 + 垂直居中 + 间距 */
export const THEME_ROW_CLASS = 'flex items-center justify-between gap-4 py-2';

/** 右侧控件区统一样式 */
export const THEME_CONTROL_CLASS = 'flex items-center gap-2 shrink-0';

/** 下拉触发器统一宽度，避免每个面板各自写 class */
export const THEME_SELECT_CLASS = 'w-36';

/** 分区标题（Tab 内的小节，对齐 v2 抽屉的分节留白） */
export const THEME_SECTION_TITLE_CLASS = 'text-sm font-medium';

/** 预设色卡按钮：边框即选中态（对齐 v2 LayoutModeCard 的交互） */
export const PRESET_CARD_CLASS =
  'h-auto flex flex-col items-stretch gap-1 rounded-md border-2 bg-transparent px-2 py-1.5 text-left transition-colors hover:border-primary';

/**
 * 预设色卡的底色（内联 style，不是 class）。
 * 色值由 `@vean/theme` 的 `resolveTokenColor(preset, 'primary', mode, 'hsl')` 现算，不抄调色板进 TS。
 */
export function presetSwatchStyle(color: string): Record<string, string> {
  return { backgroundColor: color };
}

/** 布局模式缩略图（P2-10 布局 Tab） 详见 docs/v3-notes.md N-047。 */
export interface LayoutModeDiagram {
  value: LayoutModeName;
  /** i18n key */
  label: string;
  boxes: readonly string[];
}

const DIAGRAM_CONTENT = 'absolute inset-0 rounded-sm bg-muted';
const DIAGRAM_HEADER = 'absolute inset-x-0 top-0 h-4 rounded-t-sm bg-primary';
const DIAGRAM_RAIL = 'absolute bottom-0 left-0 top-4 w-4 bg-primary';
const DIAGRAM_SIDEBAR = 'absolute bottom-0 left-0 top-4 w-12 bg-primary';
const DIAGRAM_PANE = 'absolute bottom-0 left-4 top-4 w-10 bg-primary/40';

/** 模式 → 导航块组合（顺序即抽屉里的展示顺序） */
const LAYOUT_MODE_BLOCKS: Array<{ value: LayoutModeName; label: string; blocks: readonly string[] }> = [
  { value: 'vertical', label: 'theme.layoutMode.vertical', blocks: [DIAGRAM_SIDEBAR] },
  { value: 'vertical-mix', label: 'theme.layoutMode.verticalMix', blocks: [DIAGRAM_RAIL, DIAGRAM_PANE] },
  { value: 'horizontal', label: 'theme.layoutMode.horizontal', blocks: [DIAGRAM_HEADER] },
  {
    value: 'top-hybrid-sidebar-first',
    label: 'theme.layoutMode.topHybridSidebarFirst',
    blocks: [DIAGRAM_HEADER, DIAGRAM_RAIL]
  },
  {
    value: 'top-hybrid-header-first',
    label: 'theme.layoutMode.topHybridHeaderFirst',
    blocks: [DIAGRAM_HEADER, DIAGRAM_SIDEBAR]
  },
  {
    value: 'vertical-hybrid-header-first',
    label: 'theme.layoutMode.verticalHybridHeaderFirst',
    blocks: [DIAGRAM_HEADER, DIAGRAM_RAIL, DIAGRAM_PANE]
  }
];

export const LAYOUT_MODE_DIAGRAMS: LayoutModeDiagram[] = LAYOUT_MODE_BLOCKS.map(item => ({
  value: item.value,
  label: item.label,
  boxes: [DIAGRAM_CONTENT, ...item.blocks]
}));

/** `LayoutModeCard` 外壳 class：选中态由边框表达 */
export const LAYOUT_MODE_CARD_CLASS =
  'h-auto cursor-pointer flex flex-col items-stretch gap-1 rounded-md border-2 bg-transparent p-1.5 transition-colors hover:border-primary';

/** 缩略图画布 */
export const LAYOUT_MODE_CANVAS_CLASS = 'relative h-8 w-full overflow-hidden rounded-sm border border-border';

/** 下拉/分段控件回传的 `string | number` → 精确的字面量联合 详见 docs/v3-notes.md N-048。 */
export function toSettingValue<T extends string>(value: string | number, items: readonly T[], fallback: T): T {
  const text = String(value);
  return items.find(item => item === text) ?? fallback;
}

/** 候选表 → store 字段的双向代理，供 `OptionRow` 直接 `v-model` */
export interface SelectFieldOptions<T extends string> {
  /** 当前值 */
  get: () => T;
  /** 合法候选（越界值回落到 `fallback`） */
  items: readonly T[];
  fallback: T;
  /** 装回一个 `setThemeSettings` 补丁 */
  patch: (value: T) => Partial<ThemeSettings>;
}

/** 「下拉控件 ↔ store 字段」的双向代理 详见 docs/v3-notes.md N-049。 */
export function useSelectField<T extends string>(
  options: SelectFieldOptions<T>
): WritableComputedRef<ThemeOptionValue> {
  const themeStore = useThemeStore();

  return computed({
    get: options.get,
    set: value => themeStore.setThemeSettings(options.patch(toSettingValue(value, options.items, options.fallback)))
  });
}

/** `SSwitch` 行：`label` 是文案（调用方已 `t()`），`description` 可选说明 */
export interface SwitchRowProps {
  label: string;
  modelValue: boolean;
  description?: string;
  disabled?: boolean;
  labelClass?: ClassValue;
}

export interface StepperRowProps {
  label: string;
  modelValue: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  disabled?: boolean;
}

export interface OptionRowProps<T extends ThemeOptionValue = ThemeOptionValue> {
  label: string;
  modelValue: T;
  items: readonly ThemeOptionItem<T>[];
  disabled?: boolean;
  /** 控件宽度 class，默认 `THEME_SELECT_CLASS` */
  controlClass?: ClassValue;
}

/** 把 `SInputNumber` 回传的 `null` 收敛为兜底值 详见 docs/v3-notes.md N-050。 */
export function fallbackNumber(value: number | null, fallback: number): number {
  return value ?? fallback;
}

/** 抽屉的四个 Tab（顺序即 v2：外观 / 布局 / 通用 / 操作） */
export const THEME_DRAWER_TABS = [
  { value: 'appearance', label: 'theme.tab.appearance' },
  { value: 'layout', label: 'theme.tab.layout' },
  { value: 'general', label: 'theme.tab.general' },
  { value: 'operation', label: 'theme.tab.operation' }
] as const;

export type ThemeDrawerTab = (typeof THEME_DRAWER_TABS)[number]['value'];

/** 水印时间格式候选（值即展示文本，不进 i18n） */
export const WATERMARK_TIME_FORMAT_ITEMS: ThemeOptionItem<WatermarkTimeFormat>[] = WATERMARK_TIME_FORMATS.map(
  value => ({
    value,
    label: value
  })
);
