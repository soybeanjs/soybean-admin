/** 请求环境配置 */
type ServiceEnv = Record<EnvType, EnvConfig>;

/** 环境配置 */
const serviceEnvConfig: ServiceEnv = {
  dev: {
    url: 'http://localhost:8080',
    proxy: '/api'
  },
  test: {
    url: 'http://localhost:8080',
    proxy: '/api'
  },
  prod: {
    url: 'http://localhost:8080',
    proxy: '/api'
  }
};

/**
 * 获取环境配置
 * @param env 环境描述
 */
export function getEnvConfig(env: ImportMetaEnv) {
  const { VITE_ENV_TYPE = 'dev' } = env;

  const envConfig = serviceEnvConfig[VITE_ENV_TYPE];

  return envConfig;
}
