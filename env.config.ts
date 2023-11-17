/**
 * create service config by current env
 * @param env the current env
 */
export function createServiceConfig(env: Env.ImportMeta) {
  const mockURL = 'https://mock.apifox.com/m1/3109515-0-default';

  const serviceConfigMap = {
    dev: {
      baseURL: mockURL,
      otherBaseURL: {
        demo: 'http://localhost:9528'
      }
    },
    test: {
      baseURL: mockURL,
      otherBaseURL: {
        demo: 'http://localhost:9529'
      }
    },
    prod: {
      baseURL: mockURL,
      otherBaseURL: {
        demo: 'http://localhost:9530'
      }
    }
  } satisfies App.Service.ServiceConfigMap;

  const { VITE_SERVICE_ENV = 'dev' } = env;

  return serviceConfigMap[VITE_SERVICE_ENV];
}

/**
 * get proxy pattern of service url
 * @param key if not set, will use the default key
 */
export function createProxyPattern(key?: string) {
  if (!key) {
    return '/proxy';
  }

  return `/proxy-${key}`;
}
