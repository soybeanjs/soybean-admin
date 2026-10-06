import { defineMiddleware } from 'ubean/server';

/**
 * 全局中间件（文件名前缀 `01.` 决定执行顺序）。
 *
 * 所有 API 路由（`src/routes/api/**`）与页面请求都会经过；
 * 后续鉴权 / 请求日志 / traceId 注入都挂在这里。
 */
export default defineMiddleware(async (c, next) => {
  const start = Date.now();

  await next();

  c.header('X-Response-Time', `${Date.now() - start}ms`);
});
