import { parseApiProxyKeys, resolveProxyBaseUrl } from '@/shared/api-proxy';
import { env } from '@/env';
import { createApiClients } from '@/request/factory';
import type { ApiClients } from '@/request/factory';

/**
 * 多 baseURL 代理 client（v3 §4.3 / P2-18）：`/_p/{key}/**` 由
 * `routeRules.proxy` 转发到 `API_PROXY_TARGETS` 里对应的上游。
 *
 * 浏览器只拿得到 key（`VITE_API_PROXY_KEYS`），真实 origin 在服务端 `.env`；
 * 每个实例与主实例共用 `createApiClients` 的钩子（Bearer / 业务码 / 单飞刷新 /
 * 错误去重），不是「另起一个裸实例」。
 */

/** `VITE_API_PROXY_KEYS` 解析结果（顺序 = 配置顺序，重复/非法项已剔除） */
export const API_PROXY_KEYS: readonly string[] = parseApiProxyKeys(env.apiProxyKeys);

/** key → client 三件套；未配置的 key 不出现在表里 */
const PROXY_CLIENTS: Readonly<Record<string, ApiClients>> = Object.fromEntries(
  API_PROXY_KEYS.map(key => {
    const baseUrl = resolveProxyBaseUrl(key);
    return [key, createApiClients(baseUrl)];
  })
);

/**
 * 按 key 取代理 client。
 *
 * 刻意对未配置的 key 返回 `null` 而不是抛错：调用点是页面级数据源切换，
 * 缺一个后端不该把整个页面打挂。
 */
export function resolveProxiedApiClients(key: string): ApiClients | null {
  return PROXY_CLIENTS[key] ?? null;
}

/** 运行时（配置热更 / 测试）重建代理 client 表 */
export function createProxiedApiClients(keys: readonly string[]): Record<string, ApiClients> {
  return Object.fromEntries(
    keys.filter(key => resolveProxyBaseUrl(key) !== '').map(key => [key, createApiClients(resolveProxyBaseUrl(key))])
  );
}
