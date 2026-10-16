import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type { ThemeModePreference, ThemeOptions, ThemeRadiusValue } from '@vean/theme';
import type { LayoutCollapsible, LayoutScrollBehavior, LayoutVariant, ThemeSettingsState } from '@vean/ui';
import { LAYOUT_MODE as ENV_LAYOUT_MODE, THEME_PRESET as ENV_THEME_PRESET } from 'ubean:env/client';
import { LAYOUT_MODES } from '@/constants/layout';
import type { LayoutModeName } from '@/constants/layout';
import {
  COLOR_WEAKNESS_FILTER,
  DEFAULT_LOGIN_LAYOUT,
  GRAYSCALE_FILTER,
  LOGIN_LAYOUTS,
  WATERMARK_TIME_FORMATS
} from '@/constants/theme';
import type {
  LoginLayoutName,
  PageAnimationMode,
  ResetCacheStrategy,
  TabVariant,
  WatermarkTimeFormat
} from '@/constants/theme';
import { getLocalJson, setLocalJson } from '@/utils/storage';

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

/** 布局模式（v2 语义名）与 SAppShell 模式的映射表在 `@/constants/layout` 详见 docs/v3-notes.md N-119。 */
export { LAYOUT_MODES, mapLayoutMode } from '@/constants/layout';
export type { LayoutModeName } from '@/constants/layout';

/** 水印设置（P2-12） 详见 docs/v3-notes.md N-120。 */
export interface WatermarkSettings {
  visible: boolean;
  text: string;
  enableUserName: boolean;
  enableTime: boolean;
  timeFormat: WatermarkTimeFormat;
}

/** 主题 + 布局设置（P2-10 ~ P2-15、P2-20 的配置项维度） 详见 docs/v3-notes.md N-121。 */
export interface ThemeSettings {
  /** 主题预设名（`themePresets[].name`） 详见 docs/v3-notes.md N-122。 */
  presetName: string;
  /** 明暗偏好（`light` / `dark` / `auto`） 详见 docs/v3-notes.md N-123。 */
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
  /** 登录页布局外观（P2-10 之后的追加项；只影响 `/login`，不影响后台壳） */
  loginLayout: LoginLayoutName;
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

/** env 兜底默认值（`LAYOUT_MODE` / `THEME_PRESET` 支持 dev 快速切） */
function defaultThemeSettings(): ThemeSettings {
  const envMode = ENV_LAYOUT_MODE;
  const known = LAYOUT_MODES.find(item => item.value === envMode);
  const envPreset = themePresets.some(item => item.name === ENV_THEME_PRESET)
    ? ENV_THEME_PRESET
    : themePresets[0]!.name;

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
    loginLayout: DEFAULT_LOGIN_LAYOUT,
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
 * 从 localStorage 恢复：`watermark` 是唯一嵌套对象，旧数据缺该键时浅合并会留下 `undefined`，所以显式补回默认值。
 * `loginLayout` 是后加的字段，旧数据里没有 —— 浅合并后会是 `undefined`，必须逐个候选表校验。
 */
function restoreThemeSettings(): ThemeSettings {
  const base = defaultThemeSettings();
  const stored = getLocalJson<Partial<ThemeSettings>>(THEME_STORAGE_KEY);
  if (!stored) return base;

  const merged = { ...base, ...stored };
  const loginLayout = LOGIN_LAYOUTS.find(item => item.value === merged.loginLayout)?.value ?? base.loginLayout;

  return { ...merged, loginLayout, watermark: { ...base.watermark, ...stored.watermark } };
}

/**
 * 读出持久化的主题设置（首屏种子用）。
 * 独立成纯函数：`src/app.ts` 要在 pinia 安装**之前**算出首屏信封，那时拿不到 store 实例。
 */
export function readStoredThemeSettings(): ThemeSettings {
  return restoreThemeSettings();
}

/** 主题设置 → `SConfigProvider` 的主题信封状态（首屏种子） 详见 docs/v3-notes.md N-126。 */
export function resolvePresetThemeState(settings: ThemeSettings): ThemeSettingsState {
  const found = themePresets.find(item => item.name === settings.presetName) ?? themePresets[0]!;
  const { base, primary, radius } = found;

  return { base, primary, radius, mode: settings.mode };
}

/** 滤镜（P2-10）：灰色 / 色弱写在 `<html>` 的 `style.filter` 上。 */
export function resolveFilterStyle(grayscale: boolean, colorWeakness: boolean): string {
  if (grayscale) return GRAYSCALE_FILTER;
  if (colorWeakness) return COLOR_WEAKNESS_FILTER;
  return '';
}

/** 主题**设置表 + 预设表 + 布局设置**（应用级数据） 详见 docs/v3-notes.md N-128。 */
export const useThemeStore = defineStore('theme', () => {
  const settings = ref<ThemeSettings>(restoreThemeSettings());

  const preset = computed(() => themePresets.find(item => item.name === settings.value.presetName) ?? themePresets[0]!);

  /** 可写投影：主题抽屉「当前预设」的 v-model（真值仍是 `settings.presetName`，单一来源不变） */
  const presetName = computed({
    get: () => settings.value.presetName,
    set: (name: string) => setPreset(name)
  });

  /** 传给 `SConfigProvider` 的 `theme` prop。不传 `mode` —— 明暗偏好由 provider 内部状态 + `persistTheme` 信封管理，避免两处真值。 */
  const configProviderTheme = computed<ThemeOptions>(() => ({
    base: preset.value.base,
    primary: preset.value.primary,
    radius: preset.value.radius,
    darkSelector: 'class'
  }));

  /** 当前预设对应的**完整可编辑主题状态**（引擎选项 + 明暗偏好） 详见 docs/v3-notes.md N-130。 */
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
