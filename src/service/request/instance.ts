import axios from 'axios';
import type { AxiosRequestConfig, AxiosInstance, AxiosError, CancelTokenStatic } from 'axios';
import { REQUEST_TIMEOUT } from '@/config';
import {
  getToken,
  transformRequestData,
  handleAxiosError,
  handleResponseError,
  handleBackendError,
  handleServiceResult
} from '@/utils';

/**
 * 封装axios请求类
 * @author Soybean<honghuangdc@gmail.com>
 */
export default class CustomAxiosInstance {
  instance: AxiosInstance;

  private backendSuccessCode = 200;

  cancelToken: CancelTokenStatic;

  constructor(axiosConfig: AxiosRequestConfig) {
    const defaultConfig: AxiosRequestConfig = {
      timeout: REQUEST_TIMEOUT
    };
    Object.assign(defaultConfig, axiosConfig);
    this.instance = axios.create(defaultConfig);
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
        return handleServiceResult(error, null);
      }
    );
    this.instance.interceptors.response.use(
      response => {
        const { status } = response;
        if (status === 200 || status < 300 || status === 304) {
          const backend = response.data as Service.BackendServiceResult;
          if (backend.code === this.backendSuccessCode) {
            return handleServiceResult(null, backend.data);
          }
          const error = handleBackendError(backend);
          return handleServiceResult(error, null);
        }
        const error = handleResponseError(response);
        return handleServiceResult(error, null);
      },
      (axiosError: AxiosError) => {
        const error = handleAxiosError(axiosError);
        return handleServiceResult(error, null);
      }
    );
  }
}
