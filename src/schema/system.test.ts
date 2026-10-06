import { describe, expect, it } from 'vitest';
import { parse } from 'valibot';
import { healthInfoSchema, healthStatusSchema } from './system';

/**
 * Phase 0 的样板测试：证明 vitest + valibot + `@/` 别名可用
 * （也是 CI `pnpm test` 闸门的第一条实际用例）。
 */
describe('system schema', () => {
  it('accepts the three known health statuses', () => {
    for (const status of ['ok', 'degraded', 'down'] as const) {
      expect(parse(healthStatusSchema, status)).toBe(status);
    }
  });

  it('rejects an unknown health status', () => {
    expect(() => parse(healthStatusSchema, 'unknown')).toThrow();
  });

  it('parses a health payload', () => {
    const payload = { status: 'ok', version: '3.0.0-beta.0', timestamp: 1791292512531 };

    expect(parse(healthInfoSchema, payload)).toEqual(payload);
  });

  it('rejects a health payload with a missing field', () => {
    expect(() => parse(healthInfoSchema, { status: 'ok', version: '3.0.0-beta.0' })).toThrow();
  });
});
