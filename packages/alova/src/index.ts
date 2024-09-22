import { createAlova } from 'alova';
import VueHook from 'alova/vue';
import adapterFetch from 'alova/fetch';
import { nanoid } from '@sa/utils';
import { createServerTokenAuthentication } from 'alova/client';
import { BACKEND_ERROR_CODE, REQUEST_ID_KEY } from './constant';
import { isJSON } from './shared';

export interface CustomAlovaConfig {
  baseURL: string;
  headers?: Record<string, string>;
  timeout?: number;
  expiredTokenCodes: string[];
}

export interface RequestOptions {
  refreshTokenHandler: () => Promise<boolean>;
  onBackendFail: (response: Response) => Promise<Response | null>;
}

export const createAlovaRequest = (customConfig: CustomAlovaConfig, options: RequestOptions) => {
  const { onAuthRequired, onResponseRefreshToken } = createServerTokenAuthentication({
    refreshTokenOnSuccess: {
      isExpired: async response => {
        const contentType = response.headers.get('Content-Type');
        if (isJSON(contentType ?? '')) {
          const resp = response.clone();
          const data = await resp.json();
          const responseCode = String(data.code);
          if (customConfig.expiredTokenCodes.includes(responseCode)) {
            return true;
          }
        }
        return false;
      },
      handler: async () => {
        await options.refreshTokenHandler();
      }
    },
    // 附加token
    assignToken: method => {
      const token = localStorage.getItem('SOY_token');
      method.config.headers.Authorization = token ? `Bearer ${JSON.parse(token)}` : null;
    }
  });

  const instance = createAlova({
    baseURL: customConfig.baseURL,
    timeout: customConfig.timeout ?? 10 * 1000,
    requestAdapter: adapterFetch(),
    statesHook: VueHook,
    beforeRequest: onAuthRequired(({ config }) => {
      // 添加配置headers
      config.headers = {
        ...config.headers,
        ...customConfig.headers
      };

      // set request id
      const requestId = nanoid();
      config.headers[REQUEST_ID_KEY] = requestId;
    }),
    responded: onResponseRefreshToken({
      onSuccess: async resp => {
        if (resp.ok || resp.status === 304) {
          if (isJSON(resp.headers.get('Content-Type') ?? '')) {
            const fail = await options.onBackendFail(resp);
            if (fail) {
              return fail;
            }
            return await resp.json();
          }
          return resp;
        }
        return Promise.reject(resp);
      }
    })
  });

  return instance;
};

export { BACKEND_ERROR_CODE, REQUEST_ID_KEY };
