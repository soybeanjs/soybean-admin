import axios from 'axios';
import qs from 'qs';
import type { AxiosRequestConfig, AxiosInstance } from 'axios';
import { ContentType } from '@/enum';
import { getToken } from '@/utils';
import { errorHandler } from './errorHandler';
import { transformFile } from '../utils';

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
 * @author Soybean(曹理斌) 2021-03-13
 * @class CustomAxiosInstance
 */
export default class CustomAxiosInstance {
  instance: AxiosInstance;

  constructor(
    axiosConfig: AxiosRequestConfig,
    statusConfig: StatusConfig = {
      statusKey: 'code',
      msgKey: 'message',
      successCode: 200
    }
  ) {
    this.instance = axios.create(axiosConfig);
    this.setInterceptor(statusConfig);
  }

  /** 设置请求拦截器 */
  setInterceptor(statusConfig: StatusConfig): void {
    this.instance.interceptors.request.use(
      async config => {
        const handleConfig = { ...config };
        // form类型转换
        if (handleConfig.headers['Content-Type'] === ContentType.formUrlencoded) {
          handleConfig.data = qs.stringify(handleConfig.data);
        }
        // 文件类型转换
        if (handleConfig.headers['Content-Type'] === ContentType.formData) {
          const key = Object.keys(handleConfig.data)[0];
          const file = handleConfig.data[key];
          handleConfig.data = await transformFile(file, key);
        }
        // 设置token
        handleConfig.headers.Authorization = getToken();
        return handleConfig;
      },
      error => {
        errorHandler(error);
        return Promise.reject(error);
      }
    );
    this.instance.interceptors.response.use(
      response => {
        const { status, data } = response;
        const { statusKey, msgKey, successCode } = statusConfig;
        if (status === 200 || status < 300 || status === 304) {
          if (data[statusKey] === successCode) {
            return Promise.resolve(data.data);
          }
          window.$message?.error(data[msgKey]);
          return Promise.reject(data[msgKey]);
        }
        const error = { response };
        errorHandler(error);
        return Promise.reject(error);
      },
      error => {
        errorHandler(error);
        return Promise.reject(error);
      }
    );
  }
}
