// 别名导入：本模块自己导出的 `API_PROXY_KEYS` 是解析后的结果，与 schema 原始值同名
import { API_PROXY_KEYS as ENV_API_PROXY_KEYS } from 'ubean:env/client';
import { parseApiProxyKeys, resolveProxyBaseUrl } from '@/shared/api-proxy';
import { createApiClients } from '@/request/factory';
import type { ApiClients } from '@/request/factory';

/** 多 baseURL 代理 client（v3 §4.3 / P2-18）：`/_p/{key}/**` 由 详见 docs/v3-notes.md N-243。 */

/** `API_PROXY_KEYS` 解析结果（顺序 = 配置顺序，重复/非法项已剔除） */
export const API_PROXY_KEYS: readonly string[] = parseApiProxyKeys(ENV_API_PROXY_KEYS);

/** key → client 三件套；未配置的 key 不出现在表里 */
const PROXY_CLIENTS: Readonly<Record<string, ApiClients>> = Object.fromEntries(
  API_PROXY_KEYS.map(key => {
    const baseUrl = resolveProxyBaseUrl(key);
    return [key, createApiClients(baseUrl)];
  })
);

/** 按 key 取代理 client 详见 docs/v3-notes.md N-244。 */
export function resolveProxiedApiClients(key: string): ApiClients | null {
  return PROXY_CLIENTS[key] ?? null;
}

/** 运行时（配置热更 / 测试）重建代理 client 表 */
export function createProxiedApiClients(keys: readonly string[]): Record<string, ApiClients> {
  return Object.fromEntries(
    keys.filter(key => resolveProxyBaseUrl(key) !== '').map(key => [key, createApiClients(resolveProxyBaseUrl(key))])
  );
}
