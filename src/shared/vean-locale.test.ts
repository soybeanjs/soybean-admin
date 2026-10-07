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

/**
 * 13 个出厂语言包的「存在性 + 可用性」守卫。
 *
 * `VEAN_LOCALE_PACKS` 是手写清单（`@vean/aria` 没有导出语言包枚举），写错
 * 一个码（`pt-br` 大小写、`zh-TW` 漏写）在 dev 下不会报错 —— 只有该语言切
 * 过去时组件文案静默变英文。这里逐个真的 `import()`，钉死包名与内容。
 */
describe('Vean 出厂语言包：13 个包全可用', () => {
  it('清单与子路径导出逐个对得上（key / 文案分组 / 方向）', async () => {
    const { VEAN_LOCALE_PACKS, isVeanLocalePack, registerVeanLocalePack, resolveVeanLocalePack } =
      await import('@/shared/vean-locale');

    expect(VEAN_LOCALE_PACKS).toHaveLength(13);

    for (const pack of VEAN_LOCALE_PACKS) {
      expect(isVeanLocalePack(pack), pack).toBe(true);

      const registry = await import(`@vean/aria/locale/${pack}`).then(mod => mod.default);

      expect(registry.key, pack).toBe(pack);
      expect(registry.name.length, pack).toBeGreaterThan(0);
      expect(Object.keys(registry.messages).length, pack).toBeGreaterThan(20);

      // 按需注册后，该包在 Vean 内部也能解析到自己
      await expect(registerVeanLocalePack(pack)).resolves.toBe(true);
      expect(resolveLocaleRegistry(pack).key, pack).toBe(pack);
    }

    // 未知语言：解析成 null、注册失败（调用方据此跳过，而不是静默挂 en）
    expect(resolveVeanLocalePack('xx-YY')).toBeNull();
    expect(isVeanLocalePack('xx-YY')).toBe(false);
    await expect(registerVeanLocalePack('xx-YY')).resolves.toBe(false);
  });

  it('裸码经映射表解析到语言包（zh → zh-CN，en → en）', async () => {
    const { resolveVeanLocalePack } = await import('@/shared/vean-locale');

    expect(resolveVeanLocalePack('zh')).toBe('zh-CN');
    expect(resolveVeanLocalePack('en')).toBe('en');
    expect(resolveVeanLocalePack('zh-TW')).toBe('zh-TW');
    expect(resolveVeanLocalePack('pt-BR')).toBe('pt-BR');
  });

  it('ar 包注册后方向为 rtl（与 src/shared/i18n.ts 的集合同口径）', async () => {
    const { registerVeanLocalePack } = await import('@/shared/vean-locale');
    const { resolveLocaleDir } = await import('@/shared/i18n');
    const arRegistry = await import('@vean/aria/locale/ar').then(mod => mod.default);

    await registerVeanLocalePack('ar');

    // 包自带 dir；`@vean/aria/locale` 不导出 resolveLocaleDirection，方向以包内字段为准
    expect(arRegistry.dir).toBe('rtl');
    expect(resolveLocaleDir('ar')).toBe('rtl');
    expect(resolveLocaleDir('zh-CN')).toBe('ltr');
  });
});
