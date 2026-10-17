import { defineMiddleware } from 'ubean/server';

/**
 * 全局中间件（文件名数字前缀决定执行顺序，`00.` 最先）。
 *
 * 曾经叫 `01.global.ts`，与 `01.auth.ts` 同为 `order: 1` —— `@ubean/routes` 对相同 order
 * 按稳定排序处理，实际执行顺序就取决于文件系统返回的目录序。`X-Response-Time` 是否
 * 覆盖鉴权开销、鉴权失败时是否还带头，全成了未定义行为（审计 3.4）。
 */
export default defineMiddleware(async (c, next) => {
  const start = Date.now();

  await next();

  c.header('X-Response-Time', `${Date.now() - start}ms`);
});
