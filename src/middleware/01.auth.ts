import { defineMiddleware } from 'ubean/server';
import type { Context, Next } from 'hono';
import { AppError } from '@/shared/error';
import { authService } from '@/services/auth.service';
import { permissionService } from '@/services/permission.service';
import type { AuthUserDTO } from '@/schema/auth';

/**
 * 认证 / RBAC 中间件（v3 §6.1/§2，P1-06）。
 *
 * 执行序（仅 /api/ 前缀路由）：
 * 1. 读路由 meta（ubean 注册路由时经 metaMiddleware 写入 `c.set('route')`）；
 *    `requiresAuth: false` 的路由（登录、验证码、健康检查、演示错误端点）直接放行；
 * 2. `Bearer <token>` → authService.verifyToken（签名+过期+黑名单+用户状态）；
 * 3. 权限码 `api:${method}:(/path)` 精确匹配 permissionService.checkUserHasPermission；
 *    超级管理员角色（R_super）持有全量权限码，普通用户按权限码放行。
 */

/** 无需登录即可访问的业务路由（与路由文件 defineHandlerMeta({requiresAuth:false}) 一致） */
const PUBLIC_API_PATHS = new Set([
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/refresh-token',
  '/api/auth/captcha',
  '/api/auth/error',
  '/api/system/health'
]);

const SUPER_ROLE_CODE = 'super';

export default defineMiddleware(async (c: Context, next: Next) => {
  if (!c.req.path.startsWith('/api/')) {
    return next();
  }

  const route = c.get('route');
  const requiresAuth = route ? route.meta.requiresAuth !== false : !PUBLIC_API_PATHS.has(c.req.path);

  if (!requiresAuth || PUBLIC_API_PATHS.has(c.req.path)) {
    return next();
  }

  const authorization = c.req.header('Authorization');

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AppError('UNAUTHORIZED', '未登录或令牌缺失');
  }

  const token = authorization.slice(7);
  const payload = await authService.verifyAccessToken(token);

  if (!payload) {
    throw new AppError('UNAUTHORIZED', '未登录或令牌无效');
  }

  const authUser = await authService.getUserInfo(payload.id);

  c.set('user', authUser);
  c.set('userId', authUser.id);

  // 认证域端点只需登录（token 已验），不做权限码校验；
  // 其余 RBAC: 权限码 `api:${method}:(/path)`，超级管理员全放行，其余按权限码精确匹配
  if (c.req.path.startsWith('/api/auth/') || authUser.roles?.includes(SUPER_ROLE_CODE)) {
    return next();
  }

  const matched = route ?? { method: c.req.method, path: c.req.path, meta: {} };
  const pathname = new URL(c.req.url).pathname;
  const permissionCode = `api:${matched.method.toLowerCase()}:(/${pathname.replace(/^\/api\//, '')})`;
  const allowed = await permissionService.checkUserHasPermission(authUser.id, permissionCode);

  if (!allowed) {
    throw new AppError('PERMISSION_DENIED', '无权限访问该资源');
  }

  await next();
});

/** 供测试/其他模块使用的类型收窄工具 */
export function getAuthUser(c: Context): AuthUserDTO | undefined {
  return c.get('user');
}
