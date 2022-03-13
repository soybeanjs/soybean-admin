import type { ProxyOptions } from 'vite';
import { getEnvConfig } from '../../.env-config';

/**
 * 设置网络代理
 * @param viteEnv
 */
export function createViteProxy(viteEnv: ImportMetaEnv) {
  const isOpenProxy = viteEnv.VITE_HTTP_PROXY === 'true';
  if (!isOpenProxy) return undefined;

  const { http } = getEnvConfig(viteEnv);

  const proxy: Record<string, string | ProxyOptions> = {
    [http.proxy]: {
      target: http.url,
      changeOrigin: true,
      rewrite: (path) => path.replace(new RegExp(`^${http.proxy}`), ''),
    },
  };

  return proxy;
}
