import type { ProxyOptions } from 'vite';
import { createProxyPattern, createServiceConfig } from '../../env.config';

/**
 * Set http proxy
 *
 * @param env - The current env
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
    const proxyPattern = createProxyPattern(key as App.Service.OtherBaseURLKey);

    proxy[proxyPattern] = {
      target: url,
      changeOrigin: true,
      rewrite: path => path.replace(new RegExp(`^${proxyPattern}`), '')
    };
  }

  return proxy;
}
