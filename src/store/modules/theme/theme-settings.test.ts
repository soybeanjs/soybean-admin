import { describe, expect, it } from 'vitest';
import { COLOR_WEAKNESS_FILTER, GRAYSCALE_FILTER } from '@/constants/theme';
import { readStoredThemeSettings, resolveFilterStyle, resolvePresetThemeState } from './index';

/**
 * P2-10：主题设置里两块「无 DOM 也能验证」的纯逻辑 —— 滤镜互斥、预设 → 主题信封。
 *
 * 放在这里而不是新增模块：这两个函数是 store 的对外契约（`src/app.ts` 与
 * `src/app.vue` 直接引用），导出位置就是它们的归属，测试跟着契约走。
 */

describe('滤镜（P2-10）', () => {
  it('两个开关都关时返回空串，消费方据此清掉 <html> 的 filter', () => {
    expect(resolveFilterStyle(false, false)).toBe('');
  });

  it('单独开灰色 / 单独开色弱各返回对应滤镜值', () => {
    expect(resolveFilterStyle(true, false)).toBe(GRAYSCALE_FILTER);
    expect(resolveFilterStyle(false, true)).toBe(COLOR_WEAKNESS_FILTER);
  });

  it('同时打开时灰色优先（互斥语义：后开的不遮蔽先开的）', () => {
    expect(resolveFilterStyle(true, true)).toBe(GRAYSCALE_FILTER);
  });
});

describe('预设 → 主题信封（首屏种子）', () => {
  it('按 presetName 找到预设并原样带上明暗偏好', () => {
    const settings = readStoredThemeSettings();
    const found = resolvePresetThemeState({ ...settings, presetName: settings.presetName, mode: 'dark' });

    expect(found.mode).toBe('dark');
    expect(found.primary).toBeTruthy();
    expect(found.base).toBeTruthy();
    expect(typeof found.radius).toBe('string');
  });

  it('预设名不存在时回退到第一个预设，而不是抛错或返回空信封', () => {
    const settings = readStoredThemeSettings();
    const fallback = resolvePresetThemeState({ ...settings, presetName: 'preset-that-does-not-exist' });
    const first = resolvePresetThemeState(readStoredThemeSettings());

    expect(fallback).toEqual(first);
  });

  it('LocalStorage 不可用时读出默认设置（SSR / Node 预渲染路径不炸）', () => {
    expect(readStoredThemeSettings().presetName).toBeTruthy();
    expect(readStoredThemeSettings().watermark).toBeTruthy();
  });
});
