/** 请求环境配置 */
type ServiceEnv = Record<ServiceEnvType, ServiceEnvConfig>;

/** 不同服务的环境配置 */
const serviceEnv: ServiceEnv = {
  dev: {
    url: 'http://localhost:8080',
    proxy: '/proxy-flag'
  },
  test: {
    url: 'http://localhost:8080',
    proxy: '/proxy-flag'
  },
  prod: {
    url: 'http://localhost:8080',
    proxy: '/proxy-flag'
  }
};

/**
 * 获取当前模式的环境配置
 * @param env 环境
 */
export function getEnvConfig(env: ImportMetaEnv) {
  const { VITE_ENV_TYPE = 'dev' } = env;

  const envConfig = serviceEnv[VITE_ENV_TYPE];

  return envConfig;
}
