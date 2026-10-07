import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type { ThemeOptions, ThemeRadiusValue } from '@vean/theme';
import type { AppShellMode, LayoutCollapsible, LayoutScrollBehavior, LayoutVariant } from '@vean/ui';
import { getLocalJson, setLocalJson } from '@/utils/storage';
import { env } from '@/env';

type PaletteKey = NonNullable<ThemeOptions['base']>;

/** 一套主题预设（对应 v2 的 `src/theme/preset/*.json`） */
export interface ThemePreset {
  name: string;
  label: string;
  primary: PaletteKey;
  base: PaletteKey;
  radius: ThemeRadiusValue;
}

export const themePresets: ThemePreset[] = [
  { name: 'default', label: '默认', primary: 'indigo', base: 'zinc', radius: '0.625rem' },
  { name: 'sky', label: '天蓝', primary: 'sky', base: 'slate', radius: '0.5rem' },
  { name: 'emerald', label: '翠绿', primary: 'emerald', base: 'gray', radius: '0.25rem' }
];

/**
 * 布局模式（v2 语义名）与 SAppShell 模式的映射。
 *
 * key 用 v2 命名（vertical/vertical-mix/...），value 是 `@vean/ui` 的
 * `AppShellMode`（6 模式）。菜单/持久化存 v2 名（与 v3-task 表述一致），
 * 传给 SAppShell 前经 `mapLayoutMode` 翻译。
 */
export const LAYOUT_MODES = [
  { value: 'vertical', label: '侧边栏', shell: 'sidebar' },
  { value: 'vertical-mix', label: '混合侧边', shell: 'dual-vertical' },
  { value: 'horizontal', label: '顶栏', shell: 'top' },
  { value: 'top-hybrid-sidebar-first', label: '顶栏+侧边', shell: 'vertical-horizontal' },
  { value: 'top-hybrid-header-first', label: '顶栏混合', shell: 'horizontal-vertical' },
  { value: 'vertical-hybrid-header-first', label: '三栏混合', shell: 'horizontal-dual-vertical' }
] as const;

export type LayoutModeName = (typeof LAYOUT_MODES)[number]['value'];

/** v2 布局模式名 → SAppShell 模式 */
export function mapLayoutMode(name: LayoutModeName): AppShellMode {
  return LAYOUT_MODES.find(item => item.value === name)!.shell;
}

/** 布局外观设置（SAppShell `layoutProps` 的应用侧真值） */
export interface LayoutSettings {
  mode: LayoutModeName;
  variant: LayoutVariant;
  collapsible: LayoutCollapsible;
  scrollBehavior: LayoutScrollBehavior;
  sidebarWidth: number;
  collapsedSidebarWidth: number;
  headerHeight: number;
  tabHeight: number;
  footerHeight: number;
  headerVisible: boolean;
  tabVisible: boolean;
  footerVisible: boolean;
  footerFullWidth: boolean;
  fullContent: boolean;
}

const LAYOUT_STORAGE_KEY = 'layout-settings';

/** env 兜底默认值（`VITE_LAYOUT_MODE` 支持 dev 快速切布局） */
function defaultLayoutSettings(): LayoutSettings {
  const envMode = env.layoutMode;
  const known = LAYOUT_MODES.find(item => item.value === envMode);

  return {
    mode: known ? known.value : 'vertical',
    variant: 'sidebar',
    collapsible: 'icon',
    scrollBehavior: 'wrapper',
    sidebarWidth: 240,
    collapsedSidebarWidth: 50,
    headerHeight: 56,
    tabHeight: 44,
    footerHeight: 48,
    headerVisible: true,
    tabVisible: true,
    footerVisible: true,
    footerFullWidth: false,
    fullContent: false
  };
}

/** 从 env 解析初始预设名，未知值回落 `default`（即 `themePresets[0]`） */
function getInitialPresetName(): string {
  const fromEnv = env.themePreset;

  return themePresets.some(item => item.name === fromEnv) ? fromEnv : themePresets[0]!.name;
}

/**
 * 主题**预设表 + 布局设置**（应用级数据）。
 *
 * - 主题的**运行时状态**（当前 base/primary/radius/mode、明暗切换、持久化、
 *   自定义 preset）由 `@vean/ui` 的 `SConfigProvider` 持有，消费方通过
 *   `useTheme()` 读取与修改 —— 应用层不自建 mode 状态。
 * - 布局设置是 SAppShell `layoutProps` 的真值来源；持久化到 localStorage。
 */
export const useThemeStore = defineStore('theme', () => {
  const presetName = ref(getInitialPresetName());
  const layout = ref<LayoutSettings>({
    ...defaultLayoutSettings(),
    ...getLocalJson<Partial<LayoutSettings>>(LAYOUT_STORAGE_KEY)
  });

  const preset = computed(() => themePresets.find(item => item.name === presetName.value) ?? themePresets[0]!);

  /**
   * 传给 `SConfigProvider` 的 `theme` prop。
   *
   * 不传 `mode` —— 明暗偏好由 provider 内部状态 + `persistTheme` 信封管理，
   * 避免两处真值。
   */
  const configProviderTheme = computed<ThemeOptions>(() => ({
    base: preset.value.base,
    primary: preset.value.primary,
    radius: preset.value.radius,
    darkSelector: 'class'
  }));

  /** SAppShell `layoutProps`（打开状态由壳内部持有，这里只下发静态面） */
  const layoutProps = computed(() => ({
    variant: layout.value.variant,
    collapsible: layout.value.collapsible,
    scrollBehavior: layout.value.scrollBehavior,
    sidebarWidth: layout.value.sidebarWidth,
    collapsedSidebarWidth: layout.value.collapsedSidebarWidth,
    headerHeight: layout.value.headerHeight,
    tabHeight: layout.value.tabHeight,
    footerHeight: layout.value.footerHeight,
    headerVisible: layout.value.headerVisible,
    tabVisible: layout.value.tabVisible,
    footerVisible: layout.value.footerVisible,
    footerFullWidth: layout.value.footerFullWidth,
    fullContent: layout.value.fullContent
  }));

  /** SAppShell `mode` prop（v2 名翻译为壳模式） */
  const shellMode = computed<AppShellMode>(() => mapLayoutMode(layout.value.mode));

  function setPreset(name: string): void {
    presetName.value = name;
  }

  function setLayoutSettings(patch: Partial<LayoutSettings>): void {
    layout.value = { ...layout.value, ...patch };
    setLocalJson(LAYOUT_STORAGE_KEY, layout.value);
  }

  function resetLayoutSettings(): void {
    layout.value = defaultLayoutSettings();
    setLocalJson(LAYOUT_STORAGE_KEY, layout.value);
  }

  return {
    presetName,
    preset,
    presets: themePresets,
    layout,
    configProviderTheme,
    layoutProps,
    shellMode,
    setPreset,
    setLayoutSettings,
    resetLayoutSettings
  };
});
