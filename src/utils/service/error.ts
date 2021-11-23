import type { AxiosError, AxiosResponse } from 'axios';
import type { RequestServiceError, BackendServiceResult } from '@/interface';
import {
  DEFAULT_REQUEST_ERROR_CODE,
  DEFAULT_REQUEST_ERROR_MSG,
  NETWORK_ERROR_CODE,
  NETWORK_ERROR_MSG,
  REQUEST_TIMEOUT_CODE,
  REQUEST_TIMEOUT_MSG,
  ERROR_STATUS
} from '@/config';
import { showErrorMsg } from './msg';

type ErrorStatus = keyof typeof ERROR_STATUS;

/**
 * 处理请求失败的错误
 * @param error - 错误
 */
export function handleAxiosError(axiosError: AxiosError) {
  const error: RequestServiceError = {
    type: 'axios',
    code: DEFAULT_REQUEST_ERROR_CODE,
    msg: DEFAULT_REQUEST_ERROR_MSG
  };

  if (!window.navigator.onLine || axiosError.message === 'Network Error') {
    // 网路错误
    Object.assign(error, { code: NETWORK_ERROR_CODE, msg: NETWORK_ERROR_MSG });
  } else if (axiosError.code === REQUEST_TIMEOUT_CODE && axiosError.message.includes('timeout')) {
    /** 超时错误 */
    Object.assign(error, { code: REQUEST_TIMEOUT_CODE, msg: REQUEST_TIMEOUT_MSG });
  } else if (axiosError.response) {
    // 请求不成功的错误
    const errorCode: ErrorStatus = axiosError.response.status as ErrorStatus;
    const msg = ERROR_STATUS[errorCode] || DEFAULT_REQUEST_ERROR_MSG;
    Object.assign(error, { code: errorCode || DEFAULT_REQUEST_ERROR_CODE, msg });
  }

  showErrorMsg(error);

  return error;
}

/**
 * 处理请求成功后的错误
 * @param response - 请求的响应
 */
export function handleResponseError(response: AxiosResponse) {
  const error: RequestServiceError = {
    type: 'axios',
    code: DEFAULT_REQUEST_ERROR_CODE,
    msg: DEFAULT_REQUEST_ERROR_MSG
  };

  if (!window.navigator.onLine) {
    // 网路错误
    Object.assign(error, { code: NETWORK_ERROR_CODE, msg: NETWORK_ERROR_MSG });
  } else {
    // 请求成功的状态码非200的错误
    const errorCode: ErrorStatus = response.status as ErrorStatus;
    const msg = ERROR_STATUS[errorCode] || DEFAULT_REQUEST_ERROR_MSG;
    Object.assign(error, { type: 'backend', code: errorCode, msg });
  }

  showErrorMsg(error);

  return error;
}

/**
 * 处理后端返回的错误
 * @param backendResult - 后端接口的响应数据
 */
export function handleBackendError(backendResult: BackendServiceResult) {
  const error: RequestServiceError = {
    type: 'backend',
    code: backendResult.code,
    msg: backendResult.message
  };

  showErrorMsg(error);

  return error;
}
