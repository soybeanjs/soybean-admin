import { env } from '@/env';
import { createApiClients } from '@/request/factory';
import { API_PROXY_KEYS, createProxiedApiClients, resolveProxiedApiClients } from '@/request/proxy';

/** 主请求层（v3 §5.4） 详见 docs/v3-notes.md N-241。 */
const { request, api, flatApi } = createApiClients(env.apiBaseUrl);

/** 会抛异常的 typed client（try/catch 场景） */
export { api, flatApi };

/** `/_p/{key}` 代理 client（键取自 `VITE_API_PROXY_KEYS`） */
export { API_PROXY_KEYS, createProxiedApiClients, resolveProxiedApiClients };

export default request;
