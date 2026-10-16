/**
 * Pinia store 统一出口。
 * 实例由 `defineApp({ plugins: [createPinia()] })` 安装（见 `src/app.ts`），此处只做集中导出。
 */
export { useAppStore } from './modules/app';
export { themePresets, useThemeStore } from './modules/theme';
export type { LayoutModeName, ThemePreset, ThemeSettings, WatermarkSettings } from './modules/theme';
export { LAYOUT_MODES, mapLayoutMode } from './modules/theme';
export { initAuthStore, useAuthStore } from './modules/auth';
export { useMenuStore } from './modules/menu';
export { useTabStore } from './modules/tab';
