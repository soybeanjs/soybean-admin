import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type { ThemeModePreference, ThemeOptions, ThemeRadiusValue } from '@vean/theme';
import type { LayoutCollapsible, LayoutScrollBehavior, LayoutVariant, ThemeSettingsState } from '@vean/ui';
import { LAYOUT_MODES } from '@/constants/layout';
import type { LayoutModeName } from '@/constants/layout';
import { COLOR_WEAKNESS_FILTER, GRAYSCALE_FILTER, WATERMARK_TIME_FORMATS } from '@/constants/theme';
import type { PageAnimationMode, ResetCacheStrategy, TabVariant, WatermarkTimeFormat } from '@/constants/theme';
import { getLocalJson, setLocalJson } from '@/utils/storage';
import { env } from '@/env';

type PaletteKey = NonNullable<ThemeOptions['base']>;

/** 一套主题预设（对应 v2 的 `src/theme/preset/*.json`） */
export interface ThemePreset {
  name: string;
  /** i18n key（展示时由 `t()` 解析） */
  label: string;
  primary: PaletteKey;
  base: PaletteKey;
  radius: ThemeRadiusValue;
}

export const themePresets: ThemePreset[] = [
  { name: 'default', label: 'theme.preset.default', primary: 'indigo', base: 'zinc', radius: '0.625rem' },
  { name: 'sky', label: 'theme.preset.sky', primary: 'sky', base: 'slate', radius: '0.5rem' },
  { name: 'emerald', label: 'theme.preset.emerald', primary: 'emerald', base: 'gray', radius: '0.25rem' }
];

/**
 * 布局模式（v2 语义名）与 SAppShell 模式的映射表在 `@/constants/layout`
 * （`src/shared/layout-matrix.ts` 也要读它，不该为此把 store 拖进依赖图）。
 * 这里 re-export 一份，老引用（`useThemeStore` 用法方、theme 抽屉）不必改。
 */
export { LAYOUT_MODES, mapLayoutMode } from '@/constants/layout';
export type { LayoutModeName } from '@/constants/layout';

/**
 * 水印设置（P2-12）。
 *
 * 文本优先级（对齐 v2）：`enableUserName` → `enableTime` → `text`。
 * 两个开关互斥，见 `setWatermarkEnableUserName` / `setWatermarkEnableTime`。
 */
export interface WatermarkSettings {
  visible: boolean;
  text: string;
  enableUserName: boolean;
  enableTime: boolean;
  timeFormat: WatermarkTimeFormat;
}

/**
 * 主题 + 布局设置（P2-10 ~ P2-15、P2-20 的配置项维度）。
 *
 * 一个对象一个持久化 key：主题抽屉的所有开关都写在这里，`SAppShell` 的
 * `layoutProps` / `tabProps` 由它派生，页面动画/滤镜/水印由消费方读它。
 */
export interface ThemeSettings {
  /**
   * 主题预设名（`themePresets[].name`）。
   *
   * 这是「用户选的是哪套预设」的记录；真正生效的 `base`/`primary`/`radius`
   * 存在 `SConfigProvider` 的主题信封（`__VEAN_THEME`）里，两者由
   * `src/app.vue` 的 `watchEffect` 单向同步（信封是更完整的那份真值）。
   */
  presetName: string;
  /**
   * 明暗偏好（`light` / `dark` / `auto`）。
   *
   * 真值同样在 `SConfigProvider` 的主题信封里（那里还持久化 `size` / `spacing`
   * 等本 store 不管的维度），本字段是它的镜像，仅用于「复制配置」时带上
   * 完整的 `theme.*` 命名空间（P2-10）。
   */
  mode: ThemeModePreference;
  /** 布局模式（v2 语义名，6 选 1；经 `mapLayoutMode` 翻译成 `SAppShell` 的 mode） */
  layoutMode: LayoutModeName;
  variant: LayoutVariant;
  collapsible: LayoutCollapsible;
  /** 滚动模式：`wrapper` 主体滚动 / `content` 内容滚动（P2-15） */
  scrollBehavior: LayoutScrollBehavior;
  sidebarWidth: number;
  collapsedSidebarWidth: number;
  /** 移动端抽屉宽度（P2-13） */
  mobileSidebarWidth: number;
  headerHeight: number;
  tabHeight: number;
  footerHeight: number;
  headerVisible: boolean;
  tabVisible: boolean;
  footerVisible: boolean;
  /** 面包屑显隐（P2-14） */
  breadcrumbVisible: boolean;
  /** 侧栏折叠触发器显隐（P2-14） */
  triggerVisible: boolean;
  /** 头部 + 页签吸顶（→ SLayout `fixedTop`） */
  fixedHeaderAndTab: boolean;
  /** 页脚吸底（→ SLayout `fixedFooter`） */
  fixedFooter: boolean;
  /** 页脚撑满内容宽度（→ SLayout `stretchFooter`；v2 `footerFullWidth` 在 Vean 无对应 prop） */
  stretchFooter: boolean;
  /** 隐藏头部/页签/面包屑，只留内容区 */
  fullContent: boolean;
  /** 页签风格（P2-20 矩阵维度；经 `#tabs` 槽下发 SPageTabs `variant`） */
  tabStyle: TabVariant;
  /** 页面切换动画总开关（P2-15） */
  pageAnimate: boolean;
  /** 页面切换动画模式（7 种，见 `PAGE_ANIMATION_MODES`） */
  pageAnimateMode: PageAnimationMode;
  /** 灰色模式（视觉障碍模拟，`<html>` filter） */
  grayscale: boolean;
  /** 色弱模式（反色，`<html>` filter） */
  colorWeakness: boolean;
  /** KeepAlive 缓存重置策略 */
  resetCacheStrategy: ResetCacheStrategy;
  watermark: WatermarkSettings;
}

const THEME_STORAGE_KEY = 'theme-settings';

function defaultWatermark(): WatermarkSettings {
  return {
    visible: false,
    text: '',
    enableUserName: false,
    enableTime: false,
    timeFormat: WATERMARK_TIME_FORMATS[0]!
  };
}

/** env 兜底默认值（`VITE_LAYOUT_MODE` / `VITE_THEME_PRESET` 支持 dev 快速切） */
function defaultThemeSettings(): ThemeSettings {
  const envMode = env.layoutMode;
  const known = LAYOUT_MODES.find(item => item.value === envMode);
  const envPreset = themePresets.some(item => item.name === env.themePreset) ? env.themePreset : themePresets[0]!.name;

  return {
    presetName: envPreset,
    mode: 'light',
    layoutMode: known ? known.value : 'vertical',
    variant: 'sidebar',
    collapsible: 'icon',
    scrollBehavior: 'wrapper',
    sidebarWidth: 240,
    collapsedSidebarWidth: 50,
    mobileSidebarWidth: 240,
    headerHeight: 56,
    tabHeight: 44,
    footerHeight: 48,
    headerVisible: true,
    tabVisible: true,
    footerVisible: true,
    breadcrumbVisible: true,
    triggerVisible: true,
    fixedHeaderAndTab: true,
    fixedFooter: false,
    stretchFooter: true,
    fullContent: false,
    tabStyle: 'chrome',
    pageAnimate: true,
    pageAnimateMode: 'fade-slide',
    grayscale: false,
    colorWeakness: false,
    resetCacheStrategy: 'close',
    watermark: defaultWatermark()
  };
}

/**
 * 从 localStorage 恢复：`watermark` 是唯一嵌套对象，旧数据缺该键时
 * 浅合并会留下 `undefined`，所以显式补回默认值。
 */
function restoreThemeSettings(): ThemeSettings {
  const base = defaultThemeSettings();
  const stored = getLocalJson<Partial<ThemeSettings>>(THEME_STORAGE_KEY);
  if (!stored) return base;

  const merged = { ...base, ...stored };

  return { ...merged, watermark: { ...base.watermark, ...stored.watermark } };
}

/**
 * 读出持久化的主题设置（首屏种子用）。
 *
 * 导出成独立函数是因为 `src/app.ts` 要在 pinia 安装**之前**算出首屏主题信封
 * （见 `seedPresetState`），那时还拿不到 store 实例，只能调纯函数。
 */
export function readStoredThemeSettings(): ThemeSettings {
  return restoreThemeSettings();
}

/**
 * 主题设置 → `SConfigProvider` 的主题信封状态（首屏种子）。
 *
 * 信封里还有 `size` / `spacing` 等本 store 不管的维度，那部分由
 * `SThemeCustomizer` 编辑后自行持久化，首屏种子只补「预设 + 明暗」这两项，
 * 其余字段缺失时由 provider 走自己的默认值。
 */
export function resolvePresetThemeState(settings: ThemeSettings): ThemeSettingsState {
  const found = themePresets.find(item => item.name === settings.presetName) ?? themePresets[0]!;
  const { base, primary, radius } = found;

  return { base, primary, radius, mode: settings.mode };
}

/**
 * 滤镜（P2-10）：灰色 / 色弱写在 `<html>` 的 `style.filter` 上。
 *
 * 两个开关互斥 —— 与色弱同时打开的「灰色」必须显式退出，否则后开的滤镜
 * 永远被先开的那个遮蔽；`grayscale` 优先，只由它自己让位，避免来回抢。
 */
export function resolveFilterStyle(grayscale: boolean, colorWeakness: boolean): string {
  if (grayscale) return GRAYSCALE_FILTER;
  if (colorWeakness) return COLOR_WEAKNESS_FILTER;
  return '';
}

/**
 * 主题**设置表 + 预设表 + 布局设置**（应用级数据）。
 *
 * - 主题的**运行时状态**（当前 base/primary/radius/mode、明暗切换、持久化、
 *   自定义 preset）由 `@vean/ui` 的 `SConfigProvider` 持有，消费方通过
 *   `useTheme()` 读取与修改 —— 应用层不自建 mode 状态。
 * - 本 store 只管「应用自己的外观/布局开关」：布局几何、动画、水印、滤镜、
 *   显隐，持久化到 localStorage（key `theme-settings`）。
 */
export const useThemeStore = defineStore('theme', () => {
  const settings = ref<ThemeSettings>(restoreThemeSettings());

  const preset = computed(() => themePresets.find(item => item.name === settings.value.presetName) ?? themePresets[0]!);

  /** 可写投影：主题抽屉「当前预设」的 v-model（真值仍是 `settings.presetName`，单一来源不变） */
  const presetName = computed({
    get: () => settings.value.presetName,
    set: (name: string) => setPreset(name)
  });

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

  /**
   * 当前预设对应的**完整可编辑主题状态**（引擎选项 + 明暗偏好）。
   *
   * 两个消费方：`src/app.ts` 启动时 `seedPresetState()` 种信封；主题抽屉
   * 切预设时 `applyPresetState()` 广播。带上 `mode` 是为了不覆盖用户在
   * `SThemeModeSegment` 里选的明暗（该值由 `src/app.vue` 从信封单向同步而来）。
   */
  const presetThemeState = computed<ThemeSettingsState>(() => ({
    base: preset.value.base,
    primary: preset.value.primary,
    radius: preset.value.radius,
    mode: settings.value.mode
  }));

  /** 滤镜值（P2-10）：两个开关都关时为 null，消费方据此清掉 `<html>` 的 `style.filter` */
  const filterStyle = computed(() => {
    const filter = resolveFilterStyle(settings.value.grayscale, settings.value.colorWeakness);
    return filter === '' ? null : filter;
  });

  function persist(next: ThemeSettings): void {
    settings.value = next;
    setLocalJson(THEME_STORAGE_KEY, next);
  }

  function setThemeSettings(patch: Partial<ThemeSettings>): void {
    persist({ ...settings.value, ...patch });
  }

  /** 水印补丁：嵌套对象整体重建，避免调用方改到共享引用 */
  function setWatermark(patch: Partial<WatermarkSettings>): void {
    setThemeSettings({ watermark: { ...settings.value.watermark, ...patch } });
  }

  /** 用户名与时间是互斥的两个数据源（对齐 v2 `setWatermarkEnableUserName`） */
  function setWatermarkEnableUserName(enable: boolean): void {
    setWatermark(enable ? { enableUserName: true, enableTime: false } : { enableUserName: false });
  }

  function setWatermarkEnableTime(enable: boolean): void {
    setWatermark(enable ? { enableTime: true, enableUserName: false } : { enableTime: false });
  }

  function setPreset(name: string): void {
    setThemeSettings({ presetName: name });
  }

  /** 由 app.vue 的主题状态同步写入，不反向改 provider 状态（避免回环） */
  function setModePreference(mode: ThemeModePreference): void {
    setThemeSettings({ mode });
  }

  /** 灰色与色弱互斥（对齐 v2 两个独立开关的语义），互相让位 */
  function setGrayscale(value: boolean): void {
    setThemeSettings(value ? { grayscale: true, colorWeakness: false } : { grayscale: false });
  }

  function setColorWeakness(value: boolean): void {
    setThemeSettings(value ? { colorWeakness: true, grayscale: false } : { colorWeakness: false });
  }

  function resetThemeSettings(): void {
    persist(defaultThemeSettings());
  }

  return {
    settings,
    presetName,
    preset,
    presets: themePresets,
    configProviderTheme,
    presetThemeState,
    filterStyle,
    setPreset,
    setModePreference,
    setGrayscale,
    setColorWeakness,
    setThemeSettings,
    setWatermark,
    setWatermarkEnableUserName,
    setWatermarkEnableTime,
    resetThemeSettings
  };
});
