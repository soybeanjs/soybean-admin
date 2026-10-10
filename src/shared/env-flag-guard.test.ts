import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * ubean 运行时标志（`import.meta.client` / `import.meta.server`）的禁用守卫（P4-02）。
 *
 * **为什么需要这条守卫**：ubean 0.6.0 **从不注入**这两个标志。dev 按需转换的
 * 模块与 `vp build` 的产物里都原样留下 `import.meta.client`，浏览器求值即
 * `undefined`。于是 `isClient()` 这类判据恒假，应用会**静默丢掉所有
 * localStorage 读写** —— token / 用户信息 / 主题设置 / 页签刷新即失，且不报错。
 *
 * 唯一正确的写法是能力检测：`typeof localStorage !== 'undefined'`、
 * `typeof window === 'undefined'`、`typeof document !== 'undefined'`
 * （见 `src/router/guard.ts`、`src/shared/i18n.ts`、`src/utils/storage.ts`）。
 *
 * 这条用例把「一次真实浏览器排查」的结论固化成即时反馈：新增 `import.meta.client`
 * 会在单测阶段就红，而不是等到线上用户反馈「登录状态老丢」。
 */
const srcDir = resolve(import.meta.dirname, '..');

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
