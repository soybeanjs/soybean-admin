import type { Context } from 'hono';
import type { AuthUserDTO } from '@/schema/auth';

/**
 * 审计列的写入口径（`createdBy` / `updatedBy`）。
 *
 * 这里只认 `c.get('userId')` —— `src/middleware/01.auth.ts` 验完 token 才写这个值，
 * 所以拿到的是**真实操作者**，不是某个假设值。取不到时回退 `'system'`（seed、
 * 迁移、启动期任务这些没有请求上下文的写入路径）。
 *
 * 迁移前各 service 里硬编码 `const ACTOR = 'admin'`：任何管理员编辑都记成 admin，
 * 多个运营账号同时改数据时审计列完全失去意义（审计 2.3）。
 */
export const SYSTEM_ACTOR = 'system';

/** 从请求上下文取操作者 id；无请求上下文（或未登录）时回退 `'system'` */
export function currentActor(c: Context): string {
  const userId: unknown = c.get('userId');

  return typeof userId === 'string' && userId.length > 0 ? userId : SYSTEM_ACTOR;
}

/** 从已取到的登录用户取 id（鉴权中间件已塞进 `c.set('user')`） */
export function actorOf(user: AuthUserDTO | undefined): string {
  return user?.id ?? SYSTEM_ACTOR;
}
