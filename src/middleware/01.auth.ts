import { defineMiddleware } from 'ubean/server';
import type { Context, Next } from 'hono';
import { AppError } from '@/shared/error';
import { buildApiPermissionCode } from '@/shared/route';
import { authService } from '@/services/auth.service';
import { permissionService } from '@/services/permission.service';
import type { AuthUserDTO } from '@/schema/auth';

/** 执行序（仅 /api/ 前缀路由）： 详见 docs/v3-notes.md N-073。 */

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

  // 权限码必须用**路由模板**（`/api/user/:id`），不能用具体请求路径 —— 后者会拼出`api:get:(/user/123)`，与登记的。
  const permissionCode = buildApiPermissionCode(c.req.method, c.req.routePath);
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
