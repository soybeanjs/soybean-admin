/**
 * 客户端可见环境变量。
 *
 * 为什么不用 ubean 的 `defineEnv()`：`@ubean/shared` 的 `defineEnv()`
 * （`packages/shared/src/env.ts:124`）只从 `process.env` 取值，浏览器里
 * `process` 不存在 —— public 段只会拿到 `default`，拿不到 `.env` 里的真实值。
 * 因此客户端变量一律走 Vite 原生 `import.meta.env.VITE_*`。
 *
 * 服务端变量见 `src/env.server.ts`。
 */
export const env = {
  appTitle: import.meta.env.VITE_APP_TITLE || 'SoybeanAdmin',
  appDescription: import.meta.env.VITE_APP_DESCRIPTION || '',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '',
  apiPrefix: import.meta.env.VITE_API_PREFIX || '/api',
  apiProxy: import.meta.env.VITE_API_PROXY || '',
  mode: import.meta.env.MODE,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD
} as const;
