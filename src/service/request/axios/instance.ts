import axios from 'axios';
import type { AxiosRequestConfig, AxiosInstance, CancelTokenStatic } from 'axios';
import { getToken } from '@/utils';
import { transformRequestData, handleResponseError } from '../helpers';

export interface StatusConfig {
  /** 表明请求状态的属性key */
  statusKey: string;
  /** 请求信息的属性key */
  msgKey: string;
  /** 成功状态的状态码 */
  successCode: string | number;
}

/**
 * 封装axios请求类
 * @author Soybean<honghuangdc@gmail.com> 2021-03-13
 */
export default class CustomAxiosInstance {
  instance: AxiosInstance;

  cancelToken: CancelTokenStatic;

  private statusConfig: StatusConfig = {
    statusKey: 'code',
    msgKey: 'message',
    successCode: 200
  };

  constructor(axiosConfig: AxiosRequestConfig) {
    this.instance = axios.create(axiosConfig);
    this.cancelToken = axios.CancelToken;
    this.setInterceptor();
  }

  /** 设置请求拦截器 */
  setInterceptor(): void {
    this.instance.interceptors.request.use(
      async config => {
        const handleConfig = { ...config };
        if (handleConfig.headers) {
          // 数据转换
          handleConfig.data = await transformRequestData(handleConfig.data, handleConfig.headers['Content-Type']);
          // 设置token
          handleConfig.headers.Authorization = getToken();
        }
        return handleConfig;
      },
      error => {
        handleResponseError(error);
        return Promise.reject(error);
      }
    );
    this.instance.interceptors.response.use(
      response => {
        const { status, data } = response;
        const { statusKey, msgKey, successCode } = this.statusConfig;
        if (status === 200 || status < 300 || status === 304) {
          const responseData = data as any;
          if (responseData[statusKey] === successCode) {
            return Promise.resolve(responseData.data);
          }
          window.$message?.error(responseData[msgKey]);
          return Promise.reject(responseData[msgKey]);
        }
        const error = { response };
        handleResponseError(error);
        return Promise.reject(error);
      },
      error => {
        handleResponseError(error);
        return Promise.reject(error);
      }
    );
  }
}
