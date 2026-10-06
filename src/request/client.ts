import { createRequest } from '@soybeanjs/fetch';
import { createTypedClient, toFlatTypedClient } from '@soybeanjs/fetch/openapi';
import type { paths } from '~ubean/openapi';
import { env } from '@/env';

/**
 * 统一的前端请求实例。
 *
 * - `baseURL` 为空时走同源：dev 下 ubean 在同进程内启动 Hono，`/api/**` 直接命中；
 *   生产由反向代理/同域部署承接（多环境差异见 docs/v3.md §4.3）。
 * - `paths` 来自 `.ubean/openapi.d.ts`（dev 拉 `/_openapi.json`，build 由
 *   `openapi-step` 产出），是本仓库唯一的 API 类型源。
 * - 第二泛型 `'/api'` 是**后端挂载前缀**，必须与 `ubean.config.ts` / 路由前缀一致，
 *   否则类型上的路径会整体对不上（前缀会被从 path key 里剥掉）。
 */
const request = createRequest({ baseURL: env.apiBaseUrl });

/** 会抛异常的 typed client（用于 `try/catch` 或需要 `catch` 分支的场景） */
export const api = createTypedClient<paths, '/api'>(request, '/api');

/** 永不抛异常、返回 `{ data, error, response }` 的 typed client（页面默认用它） */
export const flatApi = toFlatTypedClient<paths, '/api'>(request, '/api');
