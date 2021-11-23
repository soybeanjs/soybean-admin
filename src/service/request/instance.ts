import axios from 'axios';
import type { AxiosRequestConfig, AxiosInstance, AxiosError, CancelTokenStatic } from 'axios';
import { getToken, transformRequestData, handleAxiosError, handleResponseError, handleBackendError } from '@/utils';
import type { BackendServiceResult } from '@/interface';

/**
 * 封装axios请求类
 * @author Soybean<honghuangdc@gmail.com>
 */
export default class CustomAxiosInstance {
  instance: AxiosInstance;

  private backendSuccessCode = 200;

  cancelToken: CancelTokenStatic;

  constructor(axiosConfig: AxiosRequestConfig) {
    this.instance = axios.create(axiosConfig);
    this.cancelToken = axios.CancelToken;
    this.setInterceptor();
  }

  /** 设置请求拦截器 */
  setInterceptor() {
    this.instance.interceptors.request.use(
      async config => {
        const handleConfig = { ...config };
        if (handleConfig.headers) {
          // 数据转换
          const contentType = handleConfig.headers['Content-Type'];
          handleConfig.data = await transformRequestData(handleConfig.data, contentType);
          // 设置token
          handleConfig.headers.Authorization = getToken();
        }
        return handleConfig;
      },
      (axiosError: AxiosError) => {
        const error = handleAxiosError(axiosError);
        return Promise.reject(error);
      }
    );
    this.instance.interceptors.response.use(
      response => {
        const { status } = response;
        if (status === 200 || status < 300 || status === 304) {
          const backendServiceResult = response.data as BackendServiceResult;
          if (backendServiceResult.code === this.backendSuccessCode) {
            return Promise.resolve(backendServiceResult.data);
          }
          const error = handleBackendError(backendServiceResult);
          return Promise.reject(error);
        }
        const error = handleResponseError(response);
        return Promise.reject(error);
      },
      (axiosError: AxiosError) => {
        const error = handleAxiosError(axiosError);
        return Promise.reject(error);
      }
    );
  }
}
