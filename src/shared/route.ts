import type { Context } from 'hono';
import { AppError } from './error';

/**
 * hono 路由匹配辅助（RBAC 中间件用）。
 * `matchedRoutes(ctx)` 给的是含 `:param` 的模板，需与实际路径做模板匹配才知道命中哪条路由。
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

/** **路由模板**（`[id]`）而非请求路径 —— 两边任何一处不统一，权限码就匹配不上： 详见 docs/v3-notes.md N-169。 */
export function normalizeApiPermissionPath(path: string): string {
  const stripped = path.replace(/^\/api\//, '');

  return (stripped.startsWith('/') ? stripped : `/${stripped}`).replace(/:(\w+)/g, '[$1]');
}

/** 由接口方法与路由模板生成 RBAC 权限码（中间件与 `permission.service` 共用） */
export function buildApiPermissionCode(method: string, routePath: string): string {
  return `api:${method.toLowerCase()}:(${normalizeApiPermissionPath(routePath)})`;
}

/** 剥掉**已解析**路径里的 locale 前缀（`/en/about` → `/about`） 详见 docs/v3-notes.md N-170。 */
export function stripLocalePrefix(path: string, locales: readonly string[]): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const [first, ...rest] = normalized.split('/').filter(Boolean);

  if (!first || !locales.includes(first)) return normalized;

  return rest.length ? `/${rest.join('/')}` : '/';
}

/** 剥掉 vue-router 路径里的 locale 参数段（`/:locale(en)?/about` → `/about`） 详见 docs/v3-notes.md N-171。 */
export function normalizeRoutePath(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const stripped = normalized.replace(/^\/:locale(\([^)]*\))?\??/, '');

  if (stripped === normalized) return normalized;

  return stripped === '' ? '/' : stripped;
}

/** 读取必填路径参数（ubean 文件路由 `[id].ts` → `:id`） 详见 docs/v3-notes.md N-172。 */
export function requireParam(c: Context, key: string): string {
  const value = c.req.param(key);

  if (!value) {
    throw new AppError('PARAM_MISSING', `路径参数 ${key} 缺失`);
  }

  return value;
}
