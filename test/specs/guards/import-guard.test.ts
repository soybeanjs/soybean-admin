import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/** 它导入时，打包器会把整条聚合链带进客户端产物 —— ubean 官方实测两次： 详见 docs/v3-notes.md N-415。 */
const srcDir = resolve(import.meta.dirname, '../../../src');

/** 参与客户端构建的目录/文件（SSR 复用同一份源码，因此一并算「客户端图」）。 */
const CLIENT_GRAPH_ENTRIES = [
  'pages',
  'layouts',
  'components',
  'composables',
  'store',
  'router',
  'request',
  'shared',
  'app.ts',
  'app.vue'
];

/** 只匹配裸 `ubean` 主入口；`ubean/client` 等子路径不匹配。 */
const MAIN_ENTRY_IMPORT = /(?:from|import)\s*\(?\s*['"]ubean['"]/;

function collectFiles(entry: string): string[] {
  const full = join(srcDir, entry);

  let stat;
  try {
    stat = statSync(full);
  } catch {
    return [];
  }

  if (stat.isFile()) return [full];

  return readdirSync(full).flatMap(child => collectFiles(join(entry, child)));
}

describe('客户端图：导入纪律', () => {
  it('不从主入口 `ubean` 导入（应使用 `ubean/client` 等子路径）', () => {
    const offenders = CLIENT_GRAPH_ENTRIES.flatMap(collectFiles)
      .filter(file => /\.(ts|vue)$/.test(file))
      .filter(file => MAIN_ENTRY_IMPORT.test(readFileSync(file, 'utf-8')))
      .map(file => relative(srcDir, file));

    expect(
      offenders,
      `这些文件从主入口 ubean 导入，会把整条聚合链带进客户端产物（改用 ubean/client）：\n${offenders.join('\n')}`
    ).toEqual([]);
  });
});
