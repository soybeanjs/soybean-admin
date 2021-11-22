import type { AxiosError, AxiosResponse } from 'axios';
import { DEFAULT_REQUEST_ERROR_MSG, ERROR_STATUS, NETWORK_ERROR_MSG } from '../config';

type ErrorStatus = keyof typeof ERROR_STATUS;

/**
 * 获取请求失败的错误
 * @param error
 */
export function getFailRequestErrorMsg(error: AxiosError) {
  if (!window.navigator.onLine || error.message === 'Network Error') {
    return NETWORK_ERROR_MSG;
  }
  if (error.code === 'ECONNABORTED') {
    return error.message;
  }
  if (error.response) {
    const errorCode: ErrorStatus = error.response.status as ErrorStatus;
    const msg = ERROR_STATUS[errorCode] || DEFAULT_REQUEST_ERROR_MSG;
    return msg;
  }
  return DEFAULT_REQUEST_ERROR_MSG;
}

/**
 * 处理请求失败的错误
 * @param error - 错误
 */
export function handleAxiosError(error: AxiosError) {
  const { $message: Message } = window;

  const msg = getFailRequestErrorMsg(error);

  Message?.error(msg);
}

/**
 * 处理请求成功后的错误
 * @param response - 请求的响应
 */
export function handleResponseError(response: AxiosResponse) {
  if (!window.navigator.onLine) {
    return NETWORK_ERROR_MSG;
  }
  const errorCode: ErrorStatus = response.status as ErrorStatus;
  const msg = ERROR_STATUS[errorCode] || DEFAULT_REQUEST_ERROR_MSG;
  return msg;
}
