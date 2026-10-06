/// <reference types="vite/client" />

/**
 * 客户端可见环境变量（Vite 原生 `import.meta.env`）。
 *
 * ⚠️ 服务端变量不放这里：它们由 `src/env.server.ts` 的 `defineEnv()` 校验，
 * 且**不会**注入浏览器（`@ubean/shared` 的 defineEnv 只读 `process.env`）。
 */
interface ImportMetaEnv {
  /** 应用标题 */
  readonly VITE_APP_TITLE: string;
  /** 应用描述 */
  readonly VITE_APP_DESCRIPTION: string;
  /** 后端地址；dev 留空走同源 + 同进程 Hono */
  readonly VITE_API_BASE_URL: string;
  /** 后端挂载前缀，需与 ubean 路由前缀 / `toFlatTypedClient` 第二泛型一致 */
  readonly VITE_API_PREFIX: string;
  /** dev 代理目标（可选） */
  readonly VITE_API_PROXY: string;
  /** 后端多环境标识（local/dev/prod…，docs/v3.md §4.3） */
  readonly VITE_API_ENV: string;
  /** 初始主题预设名，需与 `themePresets` 的 `name` 匹配，未知值回落 `default` */
  readonly VITE_THEME_PRESET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
