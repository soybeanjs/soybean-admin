import type { ProxyOptions } from 'vite';

/**
 * 设置网络代理
 * @param isOpenProxy - 是否开启代理
 * @param envConfig - env环境配置
 */
export function createViteProxy(isOpenProxy: boolean, envConfig: ServiceEnvConfig) {
  if (!isOpenProxy) return undefined;

  const proxy: Record<string, string | ProxyOptions> = {
    [envConfig.urlPattern]: {
      target: envConfig.url,
      changeOrigin: true,
      rewrite: path => path.replace(new RegExp(`^${envConfig.urlPattern}`), '')
    },
    [envConfig.secondUrlPattern]: {
      target: envConfig.secondUrl,
      changeOrigin: true,
      rewrite: path => path.replace(new RegExp(`^${envConfig.secondUrlPattern}`), '')
    }
  };

  return proxy;
}
