import { describe, expect, it } from 'vitest';
import { resolveWatermarkContent, shouldRunWatermarkTimer } from './watermark';
import type { WatermarkContentSource } from './watermark';

/**
 * P2-12：水印内容优先级与计时器开关的守卫。
 *
 * 这段逻辑与 UI 无关但极易回归：优先级写反只表现为「水印显示的不是预期那条」，
 * 视觉回归看不出来；计时器该停不停则是每小时一次的隐形 CPU 浪费。
 */

function source(overrides: Partial<WatermarkContentSource> = {}): WatermarkContentSource {
  return {
    visible: true,
    text: '内部资料',
    enableUserName: false,
    enableTime: false,
    timeFormat: 'YYYY-MM-DD HH:mm',
    ...overrides
  };
}

describe('水印内容优先级', () => {
  it('不可见时内容为空（空内容 → Vean 不生成 overlay，而不是画一片空白）', () => {
    expect(resolveWatermarkContent(source({ visible: false }), 'admin', '2026-01-01 08:00')).toBe('');
  });

  it('用户名优先于时间与自定义文本（对齐 v2 优先级）', () => {
    const s = source({ enableUserName: true, enableTime: true });

    expect(resolveWatermarkContent(s, 'admin', '2026-01-01 08:00')).toBe('admin');
  });

  it('关闭用户名后时间优先于自定义文本', () => {
    const s = source({ enableTime: true });

    expect(resolveWatermarkContent(s, 'admin', '2026-01-01 08:00')).toBe('2026-01-01 08:00');
  });

  it('用户名没取到（未登录）时让位给时间，而不是显示空水印', () => {
    const s = source({ enableUserName: true, enableTime: true });

    expect(resolveWatermarkContent(s, '', '2026-01-01 08:00')).toBe('2026-01-01 08:00');
  });

  it('数据源都关闭时回退到自定义文本', () => {
    expect(resolveWatermarkContent(source(), 'admin', '2026-01-01 08:00')).toBe('内部资料');
  });
});

describe('水印计时器开关', () => {
  it('不可见时不跑计时器（隐藏的水印不需要每秒重算时间）', () => {
    expect(shouldRunWatermarkTimer(source({ visible: false, enableTime: true }))).toBe(false);
  });

  it('只开用户名时不跑计时器（内容与时间无关）', () => {
    expect(shouldRunWatermarkTimer(source({ enableUserName: true }))).toBe(false);
  });

  it('开启时间且格式非空才跑计时器', () => {
    expect(shouldRunWatermarkTimer(source({ enableTime: true }))).toBe(true);
    expect(shouldRunWatermarkTimer(source({ enableTime: true, timeFormat: '' }))).toBe(false);
  });
});
