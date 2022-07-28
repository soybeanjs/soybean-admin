import type { ProxyOptions } from 'vite';

/**
 * 设置网络代理
 * @param isOpenProxy - 是否开启代理
 * @param envConfig - env环境配置
 */
export function createViteProxy(isOpenProxy: boolean, envConfig: ServiceEnvConfig) {
  if (!isOpenProxy) return undefined;

  const proxy: Record<string, string | ProxyOptions> = {
    [envConfig.pattern]: {
      target: envConfig.url,
      changeOrigin: true,
      rewrite: path => path.replace(new RegExp(`^${envConfig.pattern}`), '')
    },
    [envConfig.pattern]: {
      target: envConfig.secondUrl,
      changeOrigin: true,
      rewrite: path => path.replace(new RegExp(`^${envConfig.pattern}`), '')
    }
  };

  return proxy;
}
