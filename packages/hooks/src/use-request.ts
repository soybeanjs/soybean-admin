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

export type HookRequestInstanceResponseFailData<ResponseData = any> = {
  data: Ref<null>;
  error: Ref<AxiosError<ResponseData>>;
};

export type HookRequestInstanceResponseData<T = any, ResponseData = any> = {
  loading: Ref<boolean>;
} & (HookRequestInstanceResponseSuccessData<T> | HookRequestInstanceResponseFailData<ResponseData>);

export interface HookRequestInstance<ResponseData = any> {
  <T = any, R extends ResponseType = 'json'>(
    config: CustomAxiosRequestConfig
  ): HookRequestInstanceResponseData<MappedType<R, T>, ResponseData>;
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

  const hookRequest: HookRequestInstance<ResponseData> = function hookRequest<T = any, R extends ResponseType = 'json'>(
    config: CustomAxiosRequestConfig
  ) {
    const { loading, startLoading, endLoading } = useLoading();

    const data = ref<MappedType<R, T> | null>(null) as Ref<MappedType<R, T>>;
    const error = ref<AxiosError<ResponseData> | null>(null) as Ref<AxiosError<ResponseData> | null>;

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
  } as HookRequestInstance<ResponseData>;

  hookRequest.cancelRequest = request.cancelRequest;
  hookRequest.cancelAllRequest = request.cancelAllRequest;

  return hookRequest;
}
