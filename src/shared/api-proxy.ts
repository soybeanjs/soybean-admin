/** 约定（.env）： 详见 docs/v3-notes.md N-131。 */

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

/** 解析 `key=origin,key2=origin2` 详见 docs/v3-notes.md N-132。 */
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

/** key → routeRules：`/_p/{key}/**` 代理到 `{origin}/**` 详见 docs/v3-notes.md N-133。 */
export function buildProxyRouteRules(targets: ApiProxyTarget[]): Record<string, { proxy: string }> {
  const rules: Record<string, { proxy: string }> = {};

  for (const { key, origin } of targets) {
    if (!PROXY_KEY_PATTERN.test(key)) continue;

    rules[`${API_PROXY_PREFIX}/${key}/**`] = { proxy: `${origin}/**` };
  }

  return rules;
}

/** 这些页面本来就只是本地演示、没有 SSR 价值，统一按 URL 前缀降级为 CSR： 详见 docs/v3-notes.md N-134。 */
export const PLUGIN_DEMO_ROUTE_PREFIX = '/plugin';

/**
 * 登录页的 SSR 豁免规则（`ssr: false`）。
 *
 * 登录壳由 `themeStore.settings.loginLayout` 选择，该值来自 localStorage —— Node 预渲染读不到，
 * 只能渲染默认的 `card`。客户端首帧读到 `split` 后会与预渲染树做 hydration diff，
 * 结果是两个壳的 DOM 混在一棵树里（分栏内容被塞进窄卡片容器）。
 *
 * 不用 `definePage({ ssr: false })`：0.6.4 的 `/vite` 插件把它写进 `route.meta.ssr`，
 * 但同一份 config 的 `routeRules` 在服务端先匹配（`resolveSelectSsr` 里 `routeRuleSsr` 生效），
 * 页面元数据赢不了，实测响应头仍是 `X-SSR-Mode: ssr`（详见 docs/v3-notes.md N-135）。
 */
export const LOGIN_ROUTE_PREFIX = '/login';

/** 演示页 + 登录页的 SSR 豁免规则（`ssr: false`），与代理规则合并后交给 ubean 的 `routeRules` */
export function buildPluginSsrRouteRules(): Record<string, { ssr: false }> {
  return {
    [`${PLUGIN_DEMO_ROUTE_PREFIX}/**`]: { ssr: false },
    [`${LOGIN_ROUTE_PREFIX}/**`]: { ssr: false }
  };
}

/** 客户端 baseURL 前缀 → key（`/_p/default` → `default`），不匹配返回 `''` */
export function resolveProxyKey(baseUrl: string): string {
  const matched = baseUrl.match(/^\/_p\/([a-z0-9][a-z0-9-]*)$/);
  return matched?.[1] ?? '';
}
