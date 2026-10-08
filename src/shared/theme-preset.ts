import { shallowRef } from 'vue';
import type { ShallowRef } from 'vue';
import { readThemeEnvelope, writeThemeEnvelope } from '@vean/theme/storage';
import type { ThemeEnvelopeInput } from '@vean/theme/storage';
import type { ThemeSettingsState } from '@vean/ui';
import { isClient } from '@/utils/storage';

/**
 * 主题预设 ↔ `@vean/ui` 主题信封的桥（P2-10）。
 *
 * 为什么需要这一层：Vean 的主题真值在 `SConfigProvider` 的内部状态 + 单一
 * 持久化信封 `__VEAN_THEME`（`persistTheme`），**不**走 props；而 `useTheme()`
 * 在 `src/app.vue`（provider 的祖先）里取不到上下文 —— provider 在自己的
 * `setup` 里才 `provide`，后代才 inject 得到。所以抽屉里「改 base/primary/
 * radius/mode」只能经组件（`SThemeCustomizer` / `SThemeModeSegment`）走
 * `useTheme()`；store 侧只做两件事：
 *
 * 1. **首次访问**把应用预设种进信封（`seedPresetState`）—— provider 初始化时
 *    读一次，于是默认外观来自 `themePresets` 而不是库的硬编码默认值；
 * 2. **切预设**时写「待应用」信号（`requestPreset`），由 provider 内层的
 *    `<ThemeBridge>` 订阅后调 `useTheme().setThemeState()` 落地 —— 那是唯一
 *    同时改生效样式**和**信封的入口。
 *
 * 已有信封（用户手动选过主题）时绝不覆盖：预设只该是首访默认值。
 */

/** 信封 → 完整可编辑主题状态（`ThemeOptions` + 明暗偏好） */
export function readThemeState(): ThemeSettingsState | null {
  const envelope = readThemeEnvelope();
  if (!envelope) return null;

  return { ...envelope.options, mode: envelope.mode };
}

/**
 * 仅当尚无持久化信封时写入（幂等、SSR 安全）。
 *
 * 必须在挂载 `SConfigProvider` 之前调用（`src/app.ts` 顶层）。
 */
export function seedPresetState(state: ThemeSettingsState): void {
  if (!isClient()) return;
  if (readThemeEnvelope()) return;

  const { mode, ...options } = state;
  const envelope: ThemeEnvelopeInput = { options, mode };

  writeThemeEnvelope(envelope);
}

/**
 * 「切预设」的请求信号 —— 见文件头「切预设」流程。
 *
 * 用模块级 `shallowRef` 而不是 DOM `CustomEvent`：事件的 `detail` 是 `unknown`，
 * 落地时必须断言才能拿回 `ThemeSettingsState`，而本仓库 lint 禁 `as T`；
 * 信号既保留类型，又天然是响应式（provider 内层的 `<ThemeBridge>` 用 `watch` 消费）。
 */
export const pendingPresetState: ShallowRef<ThemeSettingsState | null> = shallowRef(null);

/** 主题抽屉/恢复默认时发起请求，由 `<ThemeBridge>` 消费后清空 */
export function requestPreset(state: ThemeSettingsState): void {
  pendingPresetState.value = state;
}

/** 消费一次请求（无待处理时返回 null） */
export function consumePresetRequest(): ThemeSettingsState | null {
  const state = pendingPresetState.value;
  pendingPresetState.value = null;

  return state;
}
