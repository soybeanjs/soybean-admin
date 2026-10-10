import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * `definePage` 顶层字段纪律（P4-02）。
 *
 * **为什么需要这条守卫**：ubean 0.6.0 的生成器（`@ubean/vue/dist/generator.js`
 * 的 `renderRouteRecord`）只发射两个顶层字段：
 *
 * ```js
 * if (page.pageMeta?.cache === true) parts.push(`    cache: true`);
 * if (page.pageMeta?.requiresAuth === true) parts.push(`    requiresAuth: true`);
 * ```
 *
 * 其余顶层字段（`requiresAuth: false` 尤其致命）被**静默丢弃**，而且 `cache` /
 * `requiresAuth` 发射在**路由记录顶层**而非 `meta` 里 —— vue-router 只认
 * `route.meta.*`，顶层是未知 key，守卫读不到。
 *
 * 真实后果：`src/router/guard.ts` 用 `to.meta.requiresAuth === false` 判公开页，
 * 顶层 `requiresAuth: false` 丢失后该判定永假 → 未登录访问 `/login` 被重定向到
 * `/login` → 无限重定向，浏览器渲染进程 100% CPU 卡死（Playwright 的
 * `page.evaluate()` 永久挂起，看起来像「浏览器环境不可用」）。
 *
 * 修法是写进 `meta`：`computeMeta()` 是 `const base = page.pageMeta?.meta ?? {}`，
 * 然后整体 `JSON.stringify` —— **`meta` 逐字透传**。
 *
 * `docs/v3.md` §4.2 把 `requiresAuth` 列为 `definePage` 合法顶层字段，与生成器
 * 实际行为不符；本用例以生成器行为为准。
 */
const pagesDir = resolve(import.meta.dirname, '..', 'pages');

/** 生成器会静默丢弃或错误发射的顶层字段 */
const FORBIDDEN_TOP_LEVEL = ['requiresAuth', 'cache'] as const;

/** 只扫 `definePage({...})` 的顶层键：行首两空格 + `key:`（`meta` 内部的键缩进更深） */
const TOP_LEVEL_KEY = /^ {2}([A-Za-z_$][\w$]*)\s*:/;

function collectPages(dir: string): string[] {
  return readdirSync(dir).flatMap(child => {
    const full = join(dir, child);

    if (statSync(full).isDirectory()) return collectPages(full);

    return full.endsWith('.vue') ? [full] : [];
  });
}

describe('definePage 顶层字段', () => {
  it('不使用会被生成器静默丢弃的顶层字段（requiresAuth / cache 必须写进 meta）', () => {
    const offenders = collectPages(pagesDir).flatMap(file => {
      const lines = readFileSync(file, 'utf-8').split('\n');
      const start = lines.findIndex(line => /definePage\s*\(\s*\{/.test(line));

      if (start < 0) return [];

      // 从 definePage 起扫到第一个顶层 `});`（缩进 0）为止
      const end = lines.findIndex((line, index) => index > start && line.startsWith('});'));
      const body = lines.slice(start, end < 0 ? lines.length : end);

      return body
        .map((line, offset) => ({ key: TOP_LEVEL_KEY.exec(line)?.[1], line: start + offset + 1 }))
        .filter((entry): entry is { key: (typeof FORBIDDEN_TOP_LEVEL)[number]; line: number } =>
          FORBIDDEN_TOP_LEVEL.some(forbidden => forbidden === entry.key)
        )
        .map(
          ({ key, line }) => `${relative(pagesDir, file)}:${line} 顶层 \`${key}\` 会被 ubean 生成器丢弃，改写进 meta`
        );
    });

    expect(offenders, `以下页面用了会被静默丢弃的顶层字段：\n${offenders.join('\n')}`).toEqual([]);
  });

  it('每个页面都声明了 meta（否则标题 / i18n / 菜单元数据全缺）', () => {
    const missing = collectPages(pagesDir)
      .filter(file => !/^\s*meta\s*:/m.test(readFileSync(file, 'utf-8')))
      .map(file => relative(pagesDir, file));

    expect(missing, `以下页面没有 meta：\n${missing.join('\n')}`).toEqual([]);
  });
});
