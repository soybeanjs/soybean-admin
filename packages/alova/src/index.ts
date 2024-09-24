import { createAlova } from 'alova';
import VueHook from 'alova/vue';
import adapterFetch from 'alova/fetch';
import { createServerTokenAuthentication } from 'alova/client';
import { BACKEND_ERROR_CODE, REQUEST_ID_KEY } from './constant';
import { isJSON } from './shared';
import type { CustomAlovaConfig, RequestOptions } from './type';

export const createAlovaRequest = (customConfig: CustomAlovaConfig<any>, options: RequestOptions<any>) => {
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
        if (options.refreshTokenHandler) {
          await options.refreshTokenHandler();
        }
      }
    },
    refreshTokenOnError: {
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
        if (options.refreshTokenHandler) {
          await options.refreshTokenHandler();
        }
      }
    }
  });

  const instance = createAlova({
    ...customConfig,
    timeout: customConfig.timeout ?? 10 * 1000,
    requestAdapter: customConfig.requestAdapter ?? adapterFetch(),
    statesHook: VueHook,
    beforeRequest: onAuthRequired(options.onRequest),
    responded: onResponseRefreshToken({
      onSuccess: async resp => {
        // check if http status is success
        if (resp.ok || resp.status === 304) {
          if (
            !isJSON(resp.headers.get('Content-Type') ?? '') ||
            (options.isBackendSuccess && (await options.isBackendSuccess(resp)))
          ) {
            return resp;
          }
          if (options.onBackendFail) {
            const fail = await options.onBackendFail(resp);
            if (fail) {
              return fail;
            }
          }
          return options.transformBackendResponse ? await options.transformBackendResponse(resp) : resp;
        }
        throw new Error(resp.statusText);
      },
      onComplete: options.onComplete,
      onError: options.onError
    })
  });

  return instance;
};

export { BACKEND_ERROR_CODE, REQUEST_ID_KEY };
export type * from './type';
