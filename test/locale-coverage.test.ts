import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

/**
 * i18n key 护栏（P3-03）。
 *
 * `vue-i18n` 在 key 缺失时**不报错**：它把 key 原样渲染到界面上，只有在
 * 跑到那个页面并切到那个语言时才看得见。本仓 8 套 manage 页共享
 * `manage.*` 命名空间，漏一个 key 很容易在评审里滑过去，所以这里把
 * 「源码里出现的每一个 `t('x.y')` 都能在两个语言包里解析到」变成测试。
 */
const REPO_ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const LOCALE_FILES = ['src/locales/zh.json', 'src/locales/en.json'] as const;

/** 需要扫描 `t('…')` 的源码目录（页面、视图、组件、组合式函数、常量） */
const SCAN_DIRS = ['src/pages', 'src/views', 'src/components', 'src/composables', 'src/constants', 'src/layouts'];

const T_CALL_PATTERN = /(?:^|[^\w$.])t\(\s*'([\w.]+)'\s*[,)]/g;

type LocaleMessages = Record<string, unknown>;

/** 语言包节点判据（数组按末梢处理，不下钻） */
function isMessageBranch(value: unknown): value is LocaleMessages {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readLocale(path: string): LocaleMessages {
  return JSON.parse(readFileSync(join(REPO_ROOT, path), 'utf8'));
}

/** 把嵌套语言包摊平成 `a.b.c` 键集（数组/对象一律继续下钻，末梢记 key） */
function flattenKeys(messages: LocaleMessages, prefix = ''): string[] {
  return Object.entries(messages).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;

    return isMessageBranch(value) ? flattenKeys(value, path) : [path];
  });
}

/** 递归收集目录下所有 `.ts` / `.vue` 文件里的 `t('…')` 字面量 */
async function collectUsedKeys(): Promise<string[]> {
  const { readdir } = await import('node:fs/promises');

  const keys = new Set<string>();

  async function walk(dir: string) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);

      if (entry.isDirectory()) {
        await walk(path);
      } else if (/\.(ts|vue)$/.test(entry.name)) {
        for (const match of readFileSync(path, 'utf8').matchAll(T_CALL_PATTERN)) {
          keys.add(match[1]);
        }
      }
    }
  }

  for (const dir of SCAN_DIRS) {
    try {
      // 目录可能尚未创建（某个 Phase 还没落地），跳过
      await walk(join(REPO_ROOT, dir));
    } catch {
      continue;
    }
  }

  return [...keys].sort();
}

describe('i18n 语言包', () => {
  it('zh / en 顶层与嵌套键完全一致', () => {
    const [zh, en] = LOCALE_FILES.map(path => flattenKeys(readLocale(path)).sort());

    expect(zh).toEqual(en);
  });

  it('源码里用到的 t(key) 在两个语言包里都能解析', async () => {
    const used = await collectUsedKeys();

    expect(used.length).toBeGreaterThan(0);

    for (const path of LOCALE_FILES) {
      const available = new Set(flattenKeys(readLocale(path)));
      const missing = used.filter(key => !available.has(key));

      expect(missing, `${path} 缺少 key`).toEqual([]);
    }
  });
});
