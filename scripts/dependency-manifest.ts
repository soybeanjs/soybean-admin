/**
 * 构建期依赖清单（about 页数据源，P3-08）。
 *
 * 为什么在 **Node 侧** 解析而不是在浏览器里：
 * 版本号的真实值只存在于 `pnpm-workspace.yaml` 的 `catalog` 段，解析它要带一个
 * YAML 解析器（`yaml` 约 30 kB gzip）。把解析搬到构建期，产物里只剩最终表格
 * 数据（`vite.config.ts` 通过 `define` 注入 `__DEPENDENCIES__`），`yaml` 也就
 * 只需要是开发依赖。
 *
 * 数据来源两处：
 * - `package.json` 的 `dependencies` / `devDependencies`（声明范围，多数是 `^x.y.z`）
 * - `pnpm-workspace.yaml` 的 `catalog` / `catalogs`（`catalog:` 协议的落点）
 *
 * 该模块只被 `vite.config.ts`、`vitest.config.ts` 与本目录测试引用，不进客户端图。
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';

/** 依赖分组 */
export type DependencyGroup = 'dependencies' | 'devDependencies';

/** 一行依赖展示数据 */
export interface DependencyInfo {
  name: string;
  /** 解析后的展示版本（`catalog:` 协议已替换为真实版本号） */
  version: string;
  group: DependencyGroup;
}

/** 本包元信息（只取展示需要的字段） */
export interface PackageInfo {
  name: string;
  version: string;
  description: string;
  homepage: string;
  license: string;
  author: string;
}

/** `__DEPENDENCIES__` 注入体的形状 */
export interface DependencyManifest {
  packageInfo: PackageInfo;
  /** 运行时 + 开发依赖，按 `group` 再按包名排序 */
  dependencies: DependencyInfo[];
  count: {
    production: number;
    development: number;
    total: number;
  };
}

/**
 * 从任意值里读一个「字符串 → 字符串」对象字段。
 *
 * 缺失 / 类型不符 / 值非字符串时逐项跳过，永不抛错 —— YAML 与 package.json 都是
 * 外部数据，一处手写错误不该让整条构建流程挂掉。
 */
export function readStringRecord(source: unknown, key: string): Record<string, string> {
  const result: Record<string, string> = {};

  if (typeof source !== 'object' || source === null || !(key in source)) return result;

  const value: unknown = Reflect.get(source, key);

  if (typeof value !== 'object' || value === null) return result;

  for (const [name, item] of Object.entries(value)) {
    if (typeof item === 'string') result[name] = item;
  }

  return result;
}

/**
 * 从任意值里读一个「字符串 → 字符串记录」的两层对象字段（`catalogs.<name>`）。
 *
 * 非对象分支整体跳过（不产出空对象），保持结果只含真实存在的 catalog。
 */
export function readNestedStringRecord(source: unknown, key: string): Record<string, Record<string, string>> {
  const result: Record<string, Record<string, string>> = {};

  if (typeof source !== 'object' || source === null || !(key in source)) return result;

  const value: unknown = Reflect.get(source, key);

  if (typeof value !== 'object' || value === null) return result;

  for (const [name, item] of Object.entries(value)) {
    if (typeof item !== 'object' || item === null) continue;

    const inner: Record<string, string> = {};

    for (const [innerKey, innerValue] of Object.entries(item)) {
      if (typeof innerValue === 'string') inner[innerKey] = innerValue;
    }

    result[name] = inner;
  }

  return result;
}

/** `catalog:<name>` 的具名部分（捕获组 1；裸 `catalog:` 时为 `undefined`） */
const NAMED_CATALOG_PATTERN = /^catalog:(.+)$/;

/** catalog 协议的两张表：默认 catalog 与具名 catalog */
export interface CatalogTables {
  defaultCatalog: Record<string, string>;
  namedCatalogs: Record<string, Record<string, string>>;
}

/**
 * 把 `package.json` 里的依赖版本声明解析成展示值。
 *
 * - 裸 `catalog:` → 按**包名**查默认 catalog（pnpm 的裸协议即「这个包在默认
 *   catalog 里的版本」）。
 * - `catalog:<name>` → 查该具名 catalog 里的同名包。
 * - 查不到 → 保留原串（宁可在页面上看到 `catalog:`，也不编造版本号）。
 * - 其余（`^1.2.3` / `npm:xxx@latest` / git 地址）原样显示：它们表达的是声明
 *   范围而非安装结果，改写反而失真。
 */
export function resolveVersion(name: string, raw: string, tables: CatalogTables): string {
  if (!raw.startsWith('catalog:')) return raw;

  const named = NAMED_CATALOG_PATTERN.exec(raw)?.[1];

  if (!named) return tables.defaultCatalog[name] ?? raw;

  return tables.namedCatalogs[named]?.[name] ?? raw;
}

/** 读取并解析仓库根的 `pnpm-workspace.yaml`（解析失败时返回空对象，不阻断构建） */
function readCatalogTables(root: string): CatalogTables {
  let workspace: unknown;

  try {
    workspace = parseYaml(readFileSync(join(root, 'pnpm-workspace.yaml'), 'utf8'));
  } catch {
    workspace = undefined;
  }

  return {
    defaultCatalog: readStringRecord(workspace, 'catalog'),
    namedCatalogs: readNestedStringRecord(workspace, 'catalogs')
  };
}

function toDependencyInfos(
  source: Record<string, string>,
  group: DependencyGroup,
  tables: CatalogTables
): DependencyInfo[] {
  return Object.entries(source)
    .map(([name, raw]) => ({ name, version: resolveVersion(name, raw, tables), group }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** 仓库根（本文件位于 `<root>/scripts/`） */
export const REPO_ROOT = fileURLToPath(new URL('..', import.meta.url));

/**
 * 生成依赖清单。`vite.config.ts` 在构建期调用一次，结果经 `define` 注入客户端。
 */
export function buildDependencyManifest(root: string = REPO_ROOT): DependencyManifest {
  let parsedPackage: unknown;

  try {
    parsedPackage = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  } catch {
    parsedPackage = undefined;
  }

  const tables = readCatalogTables(root);
  const dependencies = toDependencyInfos(readStringRecord(parsedPackage, 'dependencies'), 'dependencies', tables);
  const development = toDependencyInfos(readStringRecord(parsedPackage, 'devDependencies'), 'devDependencies', tables);
  const author = readStringRecord(parsedPackage, 'author');
  const packageInfoSource = typeof parsedPackage === 'object' && parsedPackage !== null ? parsedPackage : {};

  const readPackageString = (key: string): string => {
    const value: unknown = Reflect.get(packageInfoSource, key);

    return typeof value === 'string' ? value : '';
  };

  return {
    packageInfo: {
      name: readPackageString('name'),
      version: readPackageString('version'),
      description: readPackageString('description'),
      homepage: readPackageString('homepage'),
      license: readPackageString('license'),
      // `author` 既可能是 `{ name }` 对象也可能是字符串，两种都兼容。
      author: author.name ?? readPackageString('author')
    },
    dependencies: [...dependencies, ...development],
    count: {
      production: dependencies.length,
      development: development.length,
      total: dependencies.length + development.length
    }
  };
}
