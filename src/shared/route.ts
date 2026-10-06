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

import type { Context } from 'hono';
import { AppError } from './error';

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
