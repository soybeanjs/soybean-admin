import { defineMiddleware } from 'ubean/server';

/** 全局中间件（文件名前缀 `01.` 决定执行顺序） 详见 docs/v3-notes.md N-075。 */
export default defineMiddleware(async (c, next) => {
  const start = Date.now();

  await next();

  c.header('X-Response-Time', `${Date.now() - start}ms`);
});
