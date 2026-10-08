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
  /** 逗号分隔的 `/_p/{key}` 代理 key（真实上游在服务端 `API_PROXY_TARGETS`） */
  apiProxyKeys: import.meta.env.VITE_API_PROXY_KEYS || '',
  apiEnv: import.meta.env.VITE_API_ENV || 'local',
  themePreset: import.meta.env.VITE_THEME_PRESET || 'default',
  layoutMode: import.meta.env.VITE_LAYOUT_MODE || 'vertical',
  authRouteMode: import.meta.env.VITE_AUTH_ROUTE_MODE || 'static',
  routeHome: import.meta.env.VITE_ROUTE_HOME || '/',
  serviceSuccessCode: import.meta.env.VITE_SERVICE_SUCCESS_CODE || '0000',
  /** 逗号分隔的码表，解析在 `src/constants/service.ts` */
  serviceLogoutCodes: import.meta.env.VITE_SERVICE_LOGOUT_CODES || '',
  serviceModalLogoutCodes: import.meta.env.VITE_SERVICE_MODAL_LOGOUT_CODES || '',
  serviceExpiredTokenCodes: import.meta.env.VITE_SERVICE_EXPIRED_TOKEN_CODES || '2001',
  staticSuperRole: import.meta.env.VITE_STATIC_SUPER_ROLE || 'super',
  storagePrefix: import.meta.env.VITE_STORAGE_PREFIX || '@soybean/',
  mode: import.meta.env.MODE,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD
} as const;
