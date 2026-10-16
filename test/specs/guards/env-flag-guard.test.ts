import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/** ubean 运行时标志（`import.meta.client` / `import.meta.server`）的禁用守卫（P4-02） 详见 docs/v3-notes.md N-414。 */
const srcDir = resolve(import.meta.dirname, '../../../src');

/** 只匹配 `import.meta.client` / `import.meta.server` 的**属性访问**，不拦文档里提到它们的注释 */
const FORBIDDEN_FLAG = /import\.meta\.(client|server)\b/;

/** 注释行里允许讨论这两个标志（本文件的说明、`src/router/guard.ts` 的警示段等） */
function isComment(line: string): boolean {
  const trimmed = line.trim();

  return trimmed.startsWith('*') || trimmed.startsWith('//') || trimmed.startsWith('/*');
}

function collectFiles(dir: string): string[] {
  return readdirSync(dir).flatMap(child => {
    const full = join(dir, child);

    if (statSync(full).isDirectory()) return collectFiles(full);

    return /\.(ts|vue)$/.test(full) ? [full] : [];
  });
}

describe('运行时环境标志', () => {
  it('代码里不读 `import.meta.client` / `import.meta.server`（ubean 不注入，恒为 undefined）', () => {
    const offenders = collectFiles(srcDir)
      .filter(file => !file.endsWith('.test.ts'))
      .flatMap(file =>
        readFileSync(file, 'utf-8')
          .split('\n')
          .map((line, index) => ({ line, index }))
          .filter(({ line }) => FORBIDDEN_FLAG.test(line) && !isComment(line))
          .map(({ index }) => `${relative(srcDir, file)}:${index + 1}`)
      );

    expect(
      offenders,
      `这些位置读了 ubean 不注入的运行时标志（恒 undefined，会导致静默失效）。改用能力检测：\n${offenders.join('\n')}`
    ).toEqual([]);
  });
});
