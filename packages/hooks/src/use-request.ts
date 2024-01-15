import { ref } from 'vue';
import type { Ref } from 'vue';
import { createFlatRequest } from '@sa/axios';
import type {
  AxiosError,
  CreateAxiosDefaults,
  CustomAxiosRequestConfig,
  MappedType,
  RequestOption,
  ResponseType
} from '@sa/axios';
import useLoading from './use-loading';

export type HookRequestInstanceResponseSuccessData<T = any> = {
  data: Ref<T>;
  error: Ref<null>;
};

export type HookRequestInstanceResponseFailData<T = any> = {
  data: Ref<null>;
  error: Ref<AxiosError<T>>;
};

export type HookRequestInstanceResponseData<T = any> = {
  loading: Ref<boolean>;
} & (HookRequestInstanceResponseSuccessData<T> | HookRequestInstanceResponseFailData<T>);

export interface HookRequestInstance {
  <T = any, R extends ResponseType = 'json'>(
    config: CustomAxiosRequestConfig
  ): HookRequestInstanceResponseData<MappedType<R, T>>;
  cancelRequest: (requestId: string) => void;
  cancelAllRequest: () => void;
}

/**
 * create a hook request instance
 *
 * @param axiosConfig
 * @param options
 */
export default function createHookRequest<ResponseData = any>(
  axiosConfig?: CreateAxiosDefaults,
  options?: Partial<RequestOption<ResponseData>>
) {
  const request = createFlatRequest<ResponseData>(axiosConfig, options);

  const hookRequest: HookRequestInstance = function hookRequest<T = any, R extends ResponseType = 'json'>(
    config: CustomAxiosRequestConfig
  ) {
    const { loading, startLoading, endLoading } = useLoading();

    const data = ref<MappedType<R, T> | null>(null);
    const error = ref<AxiosError<MappedType<R, T>> | null>(null);

    startLoading();

    request(config).then(res => {
      if (res.data) {
        data.value = res.data;
      } else {
        error.value = res.error;
      }

      endLoading();
    });

    return {
      loading,
      data,
      error
    };
  } as HookRequestInstance;

  hookRequest.cancelRequest = request.cancelRequest;
  hookRequest.cancelAllRequest = request.cancelAllRequest;

  return hookRequest;
}
