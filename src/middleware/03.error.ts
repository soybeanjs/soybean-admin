import { defineMiddleware } from 'ubean/server';
import type { ErrorHandler } from 'hono';
import { AppError } from '@/shared/error';

/**
 * 错误处理中间件（v3 §6.1，P1-03）：app.onError 回调。
 *
 * ubean 框架级错误输出是 `{ error, statusCode, data }`（UbeanError），与业务码
 * `{ code, message, data }` 不同构，因此由应用层归一：AppError 直接输出业务码，
 * 其余异常包装为 SYSTEM_ERROR（500），日志带 requestId 便于排障。
 *
 * 挂载方式：src/middleware/index.ts 中 `app.onError(handler)`。
 */
export const errorMiddleware: ErrorHandler = (error, c) => {
  const appError = AppError.isAppError(error) ? error : AppError.from(error, 'SYSTEM_ERROR', '系统错误');
  const requestId = c.get('requestId') || c.req.header('x-request-id') || 'unknown';

  console.error('[api:error]', {
    requestId,
    method: c.req.method,
    url: c.req.url,
    code: appError.code,
    message: appError.message,
    cause: appError.cause instanceof Error ? appError.cause.message : appError.cause
  });

  return c.json(appError.toResponse(), 200);
};

/**
 * 中间件目录聚合：ubean 只注册目录内各文件的 default export，
 * onError 这类 app 级配置需要在一个 default export 的中间件里完成挂载。
 */
export default defineMiddleware(async (_c, next) => {
  await next();
});
