/**
 * Create service config by current env
 *
 * @param env The current env
 */
export function createServiceConfig(env: Env.ImportMeta) {
  const mockURL = 'https://mock.apifox.com/m1/3109515-0-default';

  const serviceConfigMap: App.Service.ServiceConfigMap = {
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
  };

  const { VITE_SERVICE_ENV = 'dev' } = env;

  return serviceConfigMap[VITE_SERVICE_ENV];
}

/**
 * Get proxy pattern of service url
 *
 * @param key If not set, will use the default key
 */
export function createProxyPattern(key?: App.Service.OtherBaseURLKey) {
  if (!key) {
    return '/proxy';
  }

  return `/proxy-${key}`;
}
