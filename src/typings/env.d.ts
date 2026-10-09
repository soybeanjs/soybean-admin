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
  /** 初始布局模式（v2 语义名，见 `LAYOUT_MODES`），未知值回落 `vertical` */
  readonly VITE_LAYOUT_MODE?: string;
  /** 路由/菜单模式：static = 本地路由派生菜单；dynamic = `GET /api/menu/user` 派生（§5.3） */
  readonly VITE_AUTH_ROUTE_MODE: 'static' | 'dynamic';
  /** 登录后默认首页路径 */
  readonly VITE_ROUTE_HOME: string;
  /** 后端业务成功码 */
  readonly VITE_SERVICE_SUCCESS_CODE: string;
  /** 逗号分隔：收到即登出的业务码 */
  readonly VITE_SERVICE_LOGOUT_CODES: string;
  /** 逗号分隔：收到即弹窗确认后登出的业务码 */
  readonly VITE_SERVICE_MODAL_LOGOUT_CODES: string;
  /** 逗号分隔：令牌过期码（触发刷新重放） */
  readonly VITE_SERVICE_EXPIRED_TOKEN_CODES: string;
  /** static 模式下拥有全部权限的超级角色码 */
  readonly VITE_STATIC_SUPER_ROLE: string;
  /** localStorage key 前缀 */
  readonly VITE_STORAGE_PREFIX: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
  /** ubean 注入：是否客户端环境（SSR 下为 false） */
  readonly client: boolean;
  /** ubean 注入：是否服务端环境 */
  readonly server: boolean;
}

/**
 * 构建时间戳（ISO 8601，`vite.config.ts` 的 `define` 注入）。
 *
 * dev（vite dev server）与 build 都会在**模块求值前**由 esbuild/rolldown
 * 做纯文本替换，因此 dev 下每次重启会给新值、HMR 不重算（与 vite 官方
 * `define` 行为一致）。about 页读它展示「最后构建时间」。
 *
 * 类型声明放这里（而非 `src/constants`）的原因：它是构建器注入的自由变量，
 * 不是常量模块导出的值。
 */
declare const __BUILD_TIME__: string;

/**
 * about 页的依赖清单（`vite.config.ts` / `vitest.config.ts` 经 `define` 注入）。
 * 类型来自构建期解析器 `scripts/dependency-manifest.ts`，浏览器侧只消费结果。
 */
declare const __DEPENDENCIES__: import('../../scripts/dependency-manifest').DependencyManifest;
