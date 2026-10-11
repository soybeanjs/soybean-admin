import type { Context } from 'hono';
import { AppError } from './error';

/**
 * hono 路由匹配辅助（RBAC 中间件用）。
 *
 * `matchedRoutes(ctx)` 拿到的是含 `:param` 的路由模板，需要和实际请求路径做
 * 模板匹配（`:id` 匹配单个非 `/` 段）才能确定命中的是哪条路由。
 */

/** 判断 hono 路由模板（如 `/api/user/:id`）是否匹配实际请求路径 */
export function findHonoRouteByPath(routePath: string, path: string): boolean {
  if (!routePath.includes(':')) {
    return routePath === path;
  }

  const escapedRoutePath = routePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`^${escapedRoutePath.replace(/:(\w+)/g, '[^/]+')}$`);

  return regex.test(path);
}

/**
 * 剥掉 vue-router 路径里的 locale 参数段（`/:locale(en)?/about` → `/about`）。
 *
 * **为什么需要**：i18n 策略不是 `no_prefix` 时，ubean 把每条页面路由注册在带
 * locale 参数段的 path 上（`prefix_except_default` → `/:locale(en)?/about`）。
 * `router.getRoutes()` 返回的 `route.path` **就是这种模板字符串**，直接拿去
 * `router.push()` 会把字面量 `/:locale(en)?/about` 当成真实地址 → 404。
 *
 * 剥完的路径同时是 locale 无关的：`prefix_except_default` / `prefix_and_default`
 * 策略下服务端与客户端路由都接受无前缀路径（落点语言跟随 locale cookie）。
 *
 * 只剥**首段**且只在它是 `:locale(...)` 形式时剥（不改具名业务参数如 `/user/:id`）。
 * `no_prefix` 策略下 `route.path` 本就没有该段，此函数是恒等变换。
 */
export function normalizeRoutePath(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const stripped = normalized.replace(/^\/:locale(\([^)]*\))?\??/, '');

  if (stripped === normalized) return normalized;

  return stripped === '' ? '/' : stripped;
}

/**
 * 读取必填路径参数（ubean 文件路由 `[id].ts` → `:id`）。
 *
 * ubean 的 handler 泛型不携带具体路径，`c.req.param()` 返回 `string | undefined`；
 * 统一在这里做存在性守卫（抛 PARAM_MISSING），调用方拿到确定的 string。
 */
export function requireParam(c: Context, key: string): string {
  const value = c.req.param(key);

  if (!value) {
    throw new AppError('PARAM_MISSING', `路径参数 ${key} 缺失`);
  }

  return value;
}
