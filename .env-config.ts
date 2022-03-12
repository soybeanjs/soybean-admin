/** 请求环境配置 */
type ServiceEnv = Record<
  EnvType,
  {
    /** 请求地址 */
    url: string;
    /** 代理地址 */
    proxy: string;
  }
>;

/** 请求的环境 */
const serviceEnvConfig: ServiceEnv = {
  dev: {
    url: 'http://localhost:8080',
    proxy: '/api',
  },
  test: {
    url: 'http://localhost:8080',
    proxy: '/api',
  },
  prod: {
    url: 'http://localhost:8080',
    proxy: '/api',
  },
};

/**
 * 获取环境配置
 * @param env 环境描述
 */
export function getEnvConfig(env: ImportMetaEnv) {
  const { VITE_ENV_TYPE = 'dev' } = env;
  const envConfig = {
    http: serviceEnvConfig[VITE_ENV_TYPE],
  };
  return envConfig;
}
