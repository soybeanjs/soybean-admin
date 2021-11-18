import type { AxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios';
import CustomAxiosInstance from './instance';
import type { StatusConfig } from './instance';

type ResponseSuccess = [null, any];
type ResponseFail = [any, null];

/**
 * 封装各个请求方法及结果处理的类
 * @author Soybean<honghuangdc@gmail.com> 2021-03-15
 * @class Request
 */
class Request {
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

export function createRequest(axiosConfig: AxiosRequestConfig, statusConfig?: StatusConfig) {
  const customInstance = new CustomAxiosInstance(axiosConfig, statusConfig);
  const request = new Request(customInstance.instance);
  return request;
}
