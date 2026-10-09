import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  REPO_ROOT,
  buildDependencyManifest,
  readNestedStringRecord,
  readStringRecord,
  resolveVersion
} from '../scripts/dependency-manifest';
import type { CatalogTables, DependencyInfo } from '../scripts/dependency-manifest';

/**
 * 构建期依赖清单（about 页数据源）的契约。
 *
 * 重点防四类回归：
 * 1. `catalog:` 协议没被解析 —— 页面出现字面量 `catalog:`，看不出真实版本；
 * 2. 清单漏项 —— `package.json` 加了依赖但页面没显示；
 * 3. 结构收窄函数对畸形 YAML / JSON 抛错 —— 应当降级而不是让构建挂掉；
 * 4. 统计数字与条目数脱节。
 */

const manifest = buildDependencyManifest();

const productionNames = (): string[] =>
  manifest.dependencies.filter(item => item.group === 'dependencies').map(item => item.name);

const developmentNames = (): string[] =>
  manifest.dependencies.filter(item => item.group === 'devDependencies').map(item => item.name);

/** 直接读 package.json 的依赖表（不依赖清单内部实现） */
function declared(key: string): Record<string, string> {
  return readStringRecord(JSON.parse(readFileSync(join(REPO_ROOT, 'package.json'), 'utf8')), key);
}

/** 空 catalog 表，用于纯函数用例（不碰磁盘） */
const emptyTables: CatalogTables = { defaultCatalog: {}, namedCatalogs: {} };

describe('about 依赖清单', () => {
  it('运行时依赖名与 package.json 的 dependencies 完全一致', () => {
    expect(productionNames().sort()).toEqual(Object.keys(declared('dependencies')).sort());
  });

  it('开发依赖名与 package.json 的 devDependencies 完全一致', () => {
    expect(developmentNames().sort()).toEqual(Object.keys(declared('devDependencies')).sort());
  });

  it('没有残留的 catalog: 字面量（协议必须解析成真实版本）', () => {
    const unresolved = manifest.dependencies.filter(item => item.version.startsWith('catalog:'));

    expect(unresolved).toEqual([]);
  });

  it('catalog 协议解析到 pnpm-workspace.yaml 的真实版本', () => {
    // 这两个包在本仓用 `catalog:` 声明，真实版本写在 pnpm-workspace.yaml
    expect(
      resolveVersion('vite-plus', 'catalog:', { defaultCatalog: { 'vite-plus': '1.0.0' }, namedCatalogs: {} })
    ).toBe('1.0.0');
    expect(
      resolveVersion('vue-i18n', 'catalog:', { defaultCatalog: { 'vue-i18n': '11.4.13' }, namedCatalogs: {} })
    ).toBe('11.4.13');
  });

  it('具名 catalog 协议从 catalogs.<name> 取值', () => {
    const tables: CatalogTables = { defaultCatalog: {}, namedCatalogs: { legacy: { vue: '2.7.0' } } };

    expect(resolveVersion('vue', 'catalog:legacy', tables)).toBe('2.7.0');
    expect(resolveVersion('vue', 'catalog:missing', tables)).toBe('catalog:missing');
  });

  it('非 catalog 声明原样保留（不篡改声明范围）', () => {
    expect(resolveVersion('ubean', '^0.6.0', emptyTables)).toBe('^0.6.0');
    expect(resolveVersion('typescript', 'npm:typescript-native-bridge@latest', emptyTables)).toBe(
      'npm:typescript-native-bridge@latest'
    );
  });

  it('未知 catalog 包名保留原串，不编造版本', () => {
    expect(resolveVersion('this-package-does-not-exist', 'catalog:', emptyTables)).toBe('catalog:');
  });

  it('按包名字母序排列', () => {
    expect(productionNames()).toEqual([...productionNames()].sort());
    expect(developmentNames()).toEqual([...developmentNames()].sort());
  });

  it('每项版本非空', () => {
    for (const item of manifest.dependencies) {
      expect(item.version.length).toBeGreaterThan(0);
    }
  });

  it('统计数字与实际条目数一致', () => {
    expect(manifest.count.production).toBe(productionNames().length);
    expect(manifest.count.development).toBe(developmentNames().length);
    expect(manifest.count.total).toBe(manifest.dependencies.length);
  });

  it('包元信息来自 package.json 且非空', () => {
    const pkg = JSON.parse(readFileSync(join(REPO_ROOT, 'package.json'), 'utf8'));

    expect(manifest.packageInfo.name).toBe(pkg.name);
    expect(manifest.packageInfo.version).toBe(pkg.version);
    expect(manifest.packageInfo.homepage).toBe(pkg.homepage);
    expect(manifest.packageInfo.license).toBe(pkg.license);
    expect(manifest.packageInfo.author).toBe(pkg.author.name);
    expect(manifest.packageInfo.description.length).toBeGreaterThan(0);
  });

  it('清单可被 JSON 序列化（构建期经 define 注入，函数/undefined 会丢失）', () => {
    const roundTrip: DependencyInfo[] = JSON.parse(JSON.stringify(manifest.dependencies));

    expect(roundTrip).toEqual(manifest.dependencies);
  });
});

describe('readStringRecord / readNestedStringRecord 结构收窄', () => {
  it('非对象 / 缺字段 / 值类型不符时安全降级为空记录', () => {
    expect(readStringRecord(null, 'catalog')).toEqual({});
    expect(readStringRecord(undefined, 'catalog')).toEqual({});
    expect(readStringRecord(42, 'catalog')).toEqual({});
    expect(readStringRecord('text', 'catalog')).toEqual({});
    expect(readStringRecord({}, 'catalog')).toEqual({});
    expect(readStringRecord({ catalog: 'not-an-object' }, 'catalog')).toEqual({});
    expect(readStringRecord({ catalog: null }, 'catalog')).toEqual({});
  });

  it('跳过非字符串叶子，保留字符串项', () => {
    expect(readStringRecord({ catalog: { a: '1.0.0', b: 2, c: null, d: true } }, 'catalog')).toEqual({ a: '1.0.0' });
  });

  it('readNestedStringRecord 读二层结构，整体跳过非对象分支与非字符串叶子', () => {
    const source = { catalogs: { legacy: { vue: '2.7.0', bad: 3 }, broken: 'no' } };

    expect(readNestedStringRecord(source, 'catalogs')).toEqual({ legacy: { vue: '2.7.0' } });
    expect(readNestedStringRecord(source, 'missing')).toEqual({});
    expect(readNestedStringRecord(null, 'catalogs')).toEqual({});
  });
});
