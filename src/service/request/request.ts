import type { AxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios';
import type { RequestServiceError, CustomSuccessRequestResult, CustomFailRequestResult } from '@/interface';
import CustomAxiosInstance from './instance';

/**
 * 封装各个请求方法及结果处理的类
 * @author Soybean<honghuangdc@gmail.com>
 */
export class Request {
  instance: AxiosInstance;

  constructor(instance: AxiosInstance) {
    this.instance = instance;
  }

  static successHandler<ResponseData>(response: AxiosResponse) {
    const successResult: CustomSuccessRequestResult<ResponseData> = {
      data: response as unknown as ResponseData,
      error: null
    };

    return successResult;
  }

  static failHandler(error: RequestServiceError) {
    const failResult: CustomFailRequestResult = {
      data: null,
      error
    };

    return failResult;
  }

  get<ResponseData>(url: string, config?: AxiosRequestConfig) {
    return this.instance
      .get(url, config)
      .then(res => Request.successHandler<ResponseData>(res))
      .catch(Request.failHandler);
  }

  post<ResponseData>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.instance
      .post(url, data, config)
      .then(res => Request.successHandler<ResponseData>(res))
      .catch(Request.failHandler);
  }

  put<ResponseData>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.instance
      .put(url, data, config)
      .then(res => Request.successHandler<ResponseData>(res))
      .catch(Request.failHandler);
  }

  delete<ResponseData>(url: string, config?: AxiosRequestConfig) {
    return this.instance
      .delete(url, config)
      .then(res => Request.successHandler<ResponseData>(res))
      .catch(Request.failHandler);
  }
}

export function createRequest(axiosConfig: AxiosRequestConfig) {
  const customInstance = new CustomAxiosInstance(axiosConfig);
  return new Request(customInstance.instance);
}
