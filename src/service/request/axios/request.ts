import type { AxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios';

type ResponseSuccess = [null, any];
type ResponseFail = [any, null];

/**
 * 封装各个请求方法及结果处理的类
 * @author Soybean<honghuangdc@gmail.com> 2021-03-15
 * @class Request
 */
export default class Request {
  instance: AxiosInstance;

  constructor(instance: AxiosInstance) {
    this.instance = instance;
  }

  static successHandler(response: AxiosResponse) {
    const result: ResponseSuccess = [null, response];
    return result;
  }

  static failHandler(error: any) {
    const result: ResponseFail = [error, null];
    return result;
  }

  get(url: string, config?: AxiosRequestConfig) {
    return this.instance.get(url, config).then(Request.successHandler).catch(Request.failHandler);
  }

  post(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.instance.post(url, data, config).then(Request.successHandler).catch(Request.failHandler);
  }

  put(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.instance.put(url, data, config).then(Request.successHandler).catch(Request.failHandler);
  }

  delete(url: string, config?: AxiosRequestConfig) {
    return this.instance.delete(url, config).then(Request.successHandler).catch(Request.failHandler);
  }
}

// import type { AxiosRequestConfig, AxiosInstance } from 'axios';
// import { useBoolean } from '@/hooks';

// type RequestMethod = 'get' | 'post' | 'put' | 'delete';

// interface RequestParam<ResponseData> {
//   /** axios实例 */
//   instance: AxiosInstance;
//   /** 请求地址 */
//   url: string;
//   /** 请求方法 */
//   method?: RequestMethod;
//   /** axios请求配置 */
//   axiosConfig?: AxiosRequestConfig;
//   /** 请求结果的数据判断是否为空的函数 */
//   responseDataEmptyFunc?: (data: ResponseData) => boolean;
//   /** 全局请求错误时是否弹出消息 */
//   showErrorMsg?: boolean;
// }

// /**
//  * 请求函数hooks
//  * @param requestParam - 请求函数的参数
//  * @param url - 请求地址
//  * @param axiosConfig
//  */
// export default function useRequest<ResponseData>(requestParam: RequestParam<ResponseData>) {
//   /** 网络状况 */
//   const { bool: networkStatus, setBool: setNetworkStatus } = useBoolean(window.navigator.onLine);
//   /** 是否正在请求 */
//   const { bool: isFetching, setBool: setIsFetching } = useBoolean();
//   /** 响应的结果数据是否为空 */
//   const { bool: isEmpty, setBool: setIsEmpty } = useBoolean();
// }
