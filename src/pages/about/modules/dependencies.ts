/**
 * about 页的构建期注入数据。
 *
 * 依赖清单在构建期由 `scripts/dependency-manifest.ts` 解析（见 `vite.config.ts` 的
 * `define`），这里只做「自由变量 → 具名导出」的桥接与运行时兜底，**不引入 `yaml`**：
 * 浏览器侧拿到的已是最终表格数据，构建期解析器不进客户端产物。
 *
 * 兜底分支只在非 vite/vitest 环境（如直接被 node require）命中，正常构建与测试
 * 都走注入值。`declare const` 由 `src/typings/env.d.ts` 提供。
 */
import type { DependencyManifest } from '../../../../scripts/dependency-manifest';

/** 空清单（注入缺失时的兜底，保证页面渲染成空表而不是白屏） */
const EMPTY_MANIFEST: DependencyManifest = {
  packageInfo: { name: '', version: '', description: '', homepage: '', license: '', author: '' },
  dependencies: [],
  count: { production: 0, development: 0, total: 0 }
};

function readInjected(): DependencyManifest {
  return typeof __DEPENDENCIES__ === 'undefined' ? EMPTY_MANIFEST : __DEPENDENCIES__;
}

/** 构建时间（ISO 8601，构建期注入） */
export const BUILD_TIME = __BUILD_TIME__;

/** 依赖清单（构建期注入的最终数据） */
export const DEPENDENCY_MANIFEST = readInjected();

/** 本包元信息 */
export const PACKAGE_INFO = DEPENDENCY_MANIFEST.packageInfo;

/** 全部依赖（运行时 + 开发，已按组与包名排序） */
export const DEPENDENCIES = DEPENDENCY_MANIFEST.dependencies;

/** 依赖数量概览 */
export const DEPENDENCY_COUNT = DEPENDENCY_MANIFEST.count;

/** 依赖条目与分组类型（从构建期解析器再导出，页面只需从本模块取类型） */
export type { DependencyGroup, DependencyInfo } from '../../../../scripts/dependency-manifest';
