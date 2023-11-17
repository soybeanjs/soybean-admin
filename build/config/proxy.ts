import type { ProxyOptions } from 'vite';
import { createServiceConfig, createProxyPattern } from '../../env.config';

/**
 * set http proxy
 * @param env - the current env
 */
export function createViteProxy(env: Env.ImportMeta) {
  const isEnableHttpProxy = env.VITE_HTTP_PROXY === 'Y';

  if (!isEnableHttpProxy) return undefined;

  const { baseURL, otherBaseURL } = createServiceConfig(env);

  const defaultProxyPattern = createProxyPattern();

  const proxy: Record<string, ProxyOptions> = {
    [defaultProxyPattern]: {
      target: baseURL,
      changeOrigin: true,
      rewrite: path => path.replace(new RegExp(`^${defaultProxyPattern}`), '')
    }
  };

  const otherURLEntries = Object.entries(otherBaseURL);

  for (const [key, url] of otherURLEntries) {
    const proxyPattern = createProxyPattern(key);

    proxy[proxyPattern] = {
      target: url,
      changeOrigin: true,
      rewrite: path => path.replace(new RegExp(`^${proxyPattern}`), '')
    };
  }

  return proxy;
}
