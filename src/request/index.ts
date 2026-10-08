import { env } from '@/env';
import { createApiClients } from '@/request/factory';
import { API_PROXY_KEYS, createProxiedApiClients, resolveProxiedApiClients } from '@/request/proxy';

/**
 * 主请求层（v3 §5.4）。
 *
 * - `baseURL` 为空走同源：dev 下 ubean 同进程 Hono，`/api/**` 直接命中；
 *   生产由反向代理/同域部署承接（多环境差异见 docs/v3.md §4.3）。
 * - 多 baseURL（`/_p/{key}` 代理）见 `src/request/proxy.ts`；两者共用
 *   `src/request/factory.ts` 的钩子与单飞/去重状态。
 */
const { request, api, flatApi } = createApiClients(env.apiBaseUrl);

/** 会抛异常的 typed client（try/catch 场景） */
export { api, flatApi };

/** `/_p/{key}` 代理 client（键取自 `VITE_API_PROXY_KEYS`） */
export { API_PROXY_KEYS, createProxiedApiClients, resolveProxiedApiClients };

export default request;
