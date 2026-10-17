import { shallowRef } from 'vue';
import type { ShallowRef } from 'vue';
import { readThemeEnvelope, writeThemeEnvelope } from '@vean/theme/storage';
import type { ThemeEnvelopeInput } from '@vean/theme/storage';
import type { ThemeSettingsState } from '@vean/ui';
import { isClient } from '@/utils/storage';

/** 主题 store 只做状态存取，radius/mode 的调整必须经组件（`SThemeCustomizer` / `SThemeModeSegment`）走。详见 docs/v3-notes.md N-179。 */

/** 仅当尚无持久化信封时写入（幂等、SSR 安全）。必须在挂载 `SConfigProvider` 之前调用（`src/app.ts` 顶层）。 */
export function seedPresetState(state: ThemeSettingsState): void {
  if (!isClient()) return;
  if (readThemeEnvelope()) return;

  const { mode, ...options } = state;
  const envelope: ThemeEnvelopeInput = { options, mode };

  writeThemeEnvelope(envelope);
}

/** 「切预设」的请求信号 —— 见文件头「切预设」流程。用模块级 `shallowRef` 而不是 DOM `CustomEvent`：事件的 `detail` 是 `unknown`，落地时必须断言才能拿回。 */
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
