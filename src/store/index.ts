/**
 * Pinia store 统一出口。
 *
 * 实例由 `defineApp({ plugins: [createPinia()] })` 安装（见 `src/app.ts`），
 * 这里只做集中导出，避免各页面深处散落相对路径 import。
 */
export { useAppStore } from './modules/app';
export { themePresets, useThemeStore } from './modules/theme';
export type { ThemePreset } from './modules/theme';
