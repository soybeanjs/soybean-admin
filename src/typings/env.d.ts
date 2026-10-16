/**
 * 全局自由变量声明。
 *
 * 环境变量类型**不在这里**：`ubean.config.ts` 的 `env.schema` 是唯一真相源，
 * codegen 生成 `.ubean/env.d.ts` 提供 `ImportMetaEnv` + `ubean:env/client` +
 * `ubean:env/server` 三方类型（`tsconfig.json` 的 `include` 已含 `.ubean/` 下的 d.ts）。
 * 手写 `ImportMetaEnv` 是旧做法，已删除 —— 它曾漏声明 `VITE_API_PROXY_KEYS` 而无人察觉。
 */

/** 构建时间戳（ISO 8601，`vite.config.ts` 的 `define` 注入）。 */
declare const __BUILD_TIME__: string;

/** about 页的依赖清单（`vite.config.ts` / `vitest.config.ts` 经 `define` 注入）。 */
declare const __DEPENDENCIES__: import('../../scripts/dependency-manifest').DependencyManifest;
