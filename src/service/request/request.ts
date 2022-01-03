import { ref } from 'vue';
import type { Ref } from 'vue';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import { useLoading, useBoolean } from '@/hooks';
import CustomAxiosInstance from './instance';

type RequestMethod = 'get' | 'post' | 'put' | 'delete';

type RequestResultHook<T = any> = {
  data: Ref<T | null>;
  error: Ref<Service.RequestError | null>;
  loading: Ref<boolean>;
  network: Ref<boolean>;
};

interface RequestParam {
  url: string;
  method?: RequestMethod;
  data?: any;
  axiosConfig?: AxiosRequestConfig;
}

export function createRequest(axiosConfig: AxiosRequestConfig) {
  const customInstance = new CustomAxiosInstance(axiosConfig);

  /**
   * hooks请求
   * @param param - 请求参数
   * - url: 请求地址
   * - method: 请求方法(默认get)
   * - data: 请求的body的data
   * - axiosConfig: axios配置
   * @param hookMode - 是否启用hook写法
   */
  function request<T = any>(param: RequestParam, hookMode: true): RequestResultHook<T>;
  function request<T = any>(param: RequestParam, hookMode: false): Promise<Service.RequestResult<T>>;
  function request<T = any>(
    param: RequestParam,
    hookMode: boolean
  ): RequestResultHook<T> | Promise<Service.RequestResult<T>> {
    const { url } = param;
    const method = param.method || 'get';
    const { instance } = customInstance;
    if (hookMode) {
      return useRequest(instance, method, url, param.data, param.axiosConfig);
    }
    return asyncRequest(instance, method, url, param.data, param.axiosConfig);
  }

  return request;
}

function useRequest<T = any>(
  instance: AxiosInstance,
  method: RequestMethod,
  url: string,
  bodyData?: any,
  config?: AxiosRequestConfig
): RequestResultHook<T> {
  const { loading, startLoading, endLoading } = useLoading();
  const { bool: network, setBool: setNetwork } = useBoolean(window.navigator.onLine);

  startLoading();
  const data = ref<T | null>(null) as Ref<T | null>;
  const error = ref<Service.RequestError | null>(null);

  function handleRequestResult(response: any) {
    const res = response as Service.RequestResult<T>;
    data.value = res.data;
    error.value = res.error;
    endLoading();
    setNetwork(window.navigator.onLine);
  }

  getRequestResponse(instance, method, url, bodyData, config).then(handleRequestResult);

  return {
    data,
    error,
    loading,
    network
  };
}

async function asyncRequest<T = any>(
  instance: AxiosInstance,
  method: RequestMethod,
  url: string,
  bodyData?: any,
  config?: AxiosRequestConfig
): Promise<Service.RequestResult<T>> {
  const res = (await getRequestResponse(instance, method, url, bodyData, config)) as Service.RequestResult<T>;

  return res;
}

async function getRequestResponse(
  instance: AxiosInstance,
  method: RequestMethod,
  url: string,
  data?: any,
  config?: AxiosRequestConfig
) {
  let res: any;
  if (method === 'get' || method === 'delete') {
    res = await instance[method](url, config);
  } else {
    res = await instance[method](url, data, config);
  }
  return res;
}
