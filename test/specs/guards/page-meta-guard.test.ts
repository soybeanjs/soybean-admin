import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/** `definePage` 顶层字段纪律：ubean 0.6.0 生成器只发射 `cache` / `requiresAuth` 两个顶层字段，其余（含 `requiresAuth: false`）被静默丢弃。详见 docs/v3-notes.md N-417。 */
const pagesDir = resolve(import.meta.dirname, '../../../src', 'pages');

/** 生成器会静默丢弃或错误发射的顶层字段 */
const FORBIDDEN_TOP_LEVEL = ['requiresAuth', 'cache'] as const;

/** 只扫 `definePage({...})` 的顶层键：行首两空格 + `key:`（`meta` 内部的键缩进更深） */
const TOP_LEVEL_KEY = /^ {2}([A-Za-z_$][\w$]*)\s*:/;

/** 页面私有目录：`modules/` 装搜索表单 / 操作弹窗等子组件，`components/` 装页面局部组件。 */
const PRIVATE_DIRS = new Set(['modules', 'components']);

function collectPages(dir: string): string[] {
  return readdirSync(dir).flatMap(child => {
    const full = join(dir, child);

    if (statSync(full).isDirectory()) {
      return PRIVATE_DIRS.has(child) ? [] : collectPages(full);
    }

    // `_*` 与 ubean 扫描器的 ignore 约定一致：下划线开头不参与页面扫描
    return full.endsWith('.vue') && !child.startsWith('_') ? [full] : [];
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
