import type { HttpProxy, ProxyOptions } from 'vite';
import { bgRed, bgYellow, green, lightBlue } from 'kolorist';
import { consola } from 'consola';
import { createServiceConfig } from '../../src/utils/service';

/**
 * 设置 http 代理
 *
 * @param env - 当前环境变量
 * @param enable - 是否启用 http 代理
 */
export function createViteProxy(env: Env.ImportMeta, enable: boolean) {
  const isEnableHttpProxy = enable && env.VITE_HTTP_PROXY === 'Y';

  if (!isEnableHttpProxy) return undefined;

  const isEnableProxyLog = env.VITE_PROXY_LOG === 'Y';

  const { baseURL, proxyPattern, other } = createServiceConfig(env);

  const proxy: Record<string, ProxyOptions> = createProxyItem({ baseURL, proxyPattern }, isEnableProxyLog);

  other.forEach(item => {
    Object.assign(proxy, createProxyItem(item, isEnableProxyLog));
  });

  return proxy;
}

/**
 * 创建单个代理项
 *
 * @param item 代理配置项
 * @param enableLog 是否启用日志
 */
function createProxyItem(item: App.Service.ServiceConfigItem, enableLog: boolean) {
  const proxy: Record<string, ProxyOptions> = {};

  proxy[item.proxyPattern] = {
    target: item.baseURL,
    changeOrigin: true,
    configure: (_proxy: HttpProxy.Server, options: ProxyOptions) => {
      _proxy.on('proxyReq', (_proxyReq, req, _res) => {
        if (!enableLog) return;

        const requestUrl = `${lightBlue('[proxy url]')}: ${bgYellow(` ${req.method} `)} ${green(`${item.proxyPattern}${req.url}`)}`;

        const proxyUrl = `${lightBlue('[real request url]')}: ${green(`${options.target}${req.url}`)}`;

        consola.log(`${requestUrl}\n${proxyUrl}`);
      });
      _proxy.on('error', (_err, req, _res) => {
        if (!enableLog) return;
        consola.log(bgRed(`Error: ${req.method} `), green(`${options.target}${req.url}`));
      });
    },
    rewrite: path => path.replace(new RegExp(`^${item.proxyPattern}`), '')
  };

  return proxy;
}
