/**
 * 多 baseURL 代理（v3 §4.3 / P2-18）：`/_p/{key}` 前缀代理。
 *
 * 约定（.env）：
 * - `API_PROXY_TARGETS`（server）：`key=origin,key2=origin2`，origin **不含路径**，
 *   只表示「去哪个上游」。`ubean.config.ts` 据此生成 `routeRules`。
 * - `VITE_API_PROXY_KEYS`（public）：客户端只拿得到 key 列表，拼出 `/_p/{key}`
 *   前缀请求；真实 origin 永不下发到浏览器。
 *
 * 纯函数模块：server（config）、client（请求实例）、测试三方共用，不引任何
 * 运行时依赖（`ubean.config.ts` 在 Node 里被 config loader 直接求值）。
 */

/** 所有代理前缀的公共段：请求 `/_p/{key}/api/x` → 上游 `{origin}/api/x` */
export const API_PROXY_PREFIX = '/_p';

/** 合法 key：小写字母 / 数字 / 中划线，避免路径歧义与大小写差异 */
const PROXY_KEY_PATTERN = /^[a-z0-9][a-z0-9-]*$/;

export interface ApiProxyTarget {
  key: string;
  /** 上游 origin（无尾斜杠、无路径），如 `https://api.example.com` */
  origin: string;
}

function normalizeOrigin(raw: string): string | null {
  const value = raw.trim().replace(/\/+$/, '');
  if (!/^https?:\/\/[^/\s]+$/.test(value)) return null;

  try {
    const url = new URL(value);
    return url.origin;
  } catch {
    return null;
  }
}

/**
 * 解析 `key=origin,key2=origin2`。
 *
 * - 逐项容错：缺 key / 非法 key / 非 http(s) origin 的条目直接丢弃，不让一条
 *   手滑的配置打断整个服务启动。
 * - 同 key 后写覆盖先写（便于按环境追加覆盖）。
 */
export function parseApiProxyTargets(raw: string): ApiProxyTarget[] {
  const collected = new Map<string, ApiProxyTarget>();

  for (const entry of raw.split(',')) {
    const item = entry.trim();
    if (!item) continue;

    const separatorIndex = item.indexOf('=');
    if (separatorIndex <= 0) continue;

    const key = item.slice(0, separatorIndex).trim();
    const origin = normalizeOrigin(item.slice(separatorIndex + 1));

    if (!PROXY_KEY_PATTERN.test(key) || !origin) continue;

    collected.set(key, { key, origin });
  }

  return [...collected.values()];
}

/** 解析客户端可见的 key 列表（`a,b,c`），去空白 + 去重 */
export function parseApiProxyKeys(raw: string): string[] {
  const keys: string[] = [];

  for (const entry of raw.split(',')) {
    const key = entry.trim();
    if (!PROXY_KEY_PATTERN.test(key) || keys.includes(key)) continue;

    keys.push(key);
  }

  return keys;
}

/**
 * key → 客户端 baseURL（`/_p/{key}`），未知 key 返回 `''` 表示不可用
 */
export function resolveProxyBaseUrl(key: string): string {
  return PROXY_KEY_PATTERN.test(key) ? `${API_PROXY_PREFIX}/${key}` : '';
}

/**
 * key → routeRules：`/_p/{key}/**` 代理到 `{origin}/**`。
 *
 * 目标用 `/**` 而不是写死 `/api/**`：转发时框架把规则前缀之后的后缀原样接到
 * 目标 pathname 上（`applyPathTransform`），所以 `/_p/default/api/auth/login`
 * → `{origin}/api/auth/login`，同一份配置对任意后端挂载前缀都成立。
 */
export function buildProxyRouteRules(targets: ApiProxyTarget[]): Record<string, { proxy: string }> {
  const rules: Record<string, { proxy: string }> = {};

  for (const { key, origin } of targets) {
    if (!PROXY_KEY_PATTERN.test(key)) continue;

    rules[`${API_PROXY_PREFIX}/${key}/**`] = { proxy: `${origin}/**` };
  }

  return rules;
}

/**
 * 浏览器专用演示页的 SSR 豁免（P4-01）。
 *
 * ubean 的 dev server 会对每个 HTML 请求在 Node 里预渲染整棵应用树
 * （AGENTS.md 的已知陷阱：`import.meta.server === false` 且没有 `window`）。
 * `src/views/plugin/**` 的第三方集成库都在模块求值期就碰浏览器 API
 * （`new WangEditor`、`window.HTMLCanvasElement`…），预渲染必然抛错。
 *
 * 这些页面本来就只是本地演示、没有 SSR 价值，统一按 URL 前缀降级为 CSR：
 * `routeRules['/plugin/**'] = { ssr: false }`。框架语义见 `@ubean/routes` 的
 * `resolveSelectSsr` —— `ssr === false` → `mode: 'csr'`，既不跑 loader 也不渲染，
 * 只回 CSR shell，由客户端路由挂载页面。
 *
 * **注意 routeRules 的 key 是请求路径**（`createRouteRulesMiddleware` 用
 * `c.req.path` 匹配），不是源文件路径。
 */
export const PLUGIN_DEMO_ROUTE_PREFIX = '/plugin';

/** 演示页的 SSR 豁免规则（`ssr: false`），与代理规则合并后交给 ubean 的 `routeRules` */
export function buildPluginSsrRouteRules(): Record<string, { ssr: false }> {
  return { [`${PLUGIN_DEMO_ROUTE_PREFIX}/**`]: { ssr: false } };
}

/** 客户端 baseURL 前缀 → key（`/_p/default` → `default`），不匹配返回 `''` */
export function resolveProxyKey(baseUrl: string): string {
  const matched = baseUrl.match(/^\/_p\/([a-z0-9][a-z0-9-]*)$/);
  return matched?.[1] ?? '';
}
