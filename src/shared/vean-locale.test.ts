import { describe, expect, it } from 'vitest';
import { resolveLocale, resolveLocaleRegistry } from '@vean/aria/locale';
import { APP_LOCALES } from '@/constants';

/**
 * 应用 locale key ↔ Vean 组件内置文案的对齐守卫。
 *
 * **为什么需要这条守卫**（真实回归）：`@vean/aria/locale` 出厂只注册两个 key
 * —— `en` 与 `zh-CN`，而 `resolveLocaleRegistry()` 对**未知 key 静默回落到
 * `en`**，不抛错也不警告：
 *
 * ```
 * resolveLocaleRegistry('zh').key       // 'en'（回落！）
 * resolveLocale('zh').table.emptyTitle  // 'No data'（应为「暂无数据」）
 * ```
 *
 * 本项目把应用 locale 从 `zh-CN` 改成了更简洁的 `zh`（见 `@/constants`），
 * 若无人补注册，分页 / 表格空态 / 标签页等**组件内部文案会整体变英文**，
 * 且 typecheck、lint、build、bundle budget 全部绿灯 —— 没有任何闸门能发现。
 * 这条用例把「每个 APP_LOCALES 都能解析到自己」变成即时反馈。
 *
 * 补注册在 `@/shared/vean-locale`，由 `src/app.ts` 在启动时调用；这里在
 * 测试里显式调用一次，断言的是注册后的最终状态。
 */
describe('Vean 组件文案：locale key 对齐', () => {
  it('`en` 是出厂自带 key，无需补注册', () => {
    expect(resolveLocaleRegistry('en').key).toBe('en');
  });

  it('注册后 `zh` 解析到中文文案（而非静默回落到 en）', async () => {
    const { registerVeanLocales } = await import('@/shared/vean-locale');
    registerVeanLocales();

    const registry = resolveLocaleRegistry('zh');
    expect(registry.key, '`zh` 回落到了 `en` —— 补注册缺失或失效').toBe('zh');
    expect(registry.name).toBe('简体中文');

    // 抽查几个真实取自 table / pagination 的键，确认拿到的是中文而非英文
    expect(resolveLocale('zh').table.emptyTitle).toBe('暂无数据');
    expect(resolveLocale('zh').pagination.firstPage).toBe('第一页');
    expect(resolveLocale('en').table.emptyTitle).toBe('No data');
  });

  it('APP_LOCALES 里每个 key 都能解析到自己的 registry', async () => {
    const { registerVeanLocales } = await import('@/shared/vean-locale');
    registerVeanLocales();

    for (const code of APP_LOCALES) {
      const resolved = resolveLocaleRegistry(code);
      expect(resolved.key, `APP_LOCALES 里的 \`${code}\` 未注册，会静默回落`).toBe(code);
    }
  });
});
