/** 请求环境配置 */
type ServiceEnv = Record<
  Service.HttpEnv,
  {
    /** 请求环境 */
    env: Service.HttpEnv;
    /** 请求地址 */
    url: string;
  }
>;

/** 请求的环境 */
export const serviceEnv: ServiceEnv = {
  test: {
    env: 'test',
    url: 'http://www.baidu.com'
  },
  prod: {
    env: 'prod',
    url: 'http://www.baidu.com'
  }
};
