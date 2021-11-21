import type { AxiosRequestConfig } from 'axios';
import CustomAxiosInstance from './instance';
import Request from './request';

export function createRequest(axiosConfig: AxiosRequestConfig) {
  const customInstance = new CustomAxiosInstance(axiosConfig);
  return new Request(customInstance.instance);
}
