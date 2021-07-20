import { ElMessage } from 'element-plus';

const ERROR_STATUS = {
  400: '400: 请求出现语法错误',
  401: '401: 用户未授权~',
  403: '403: 服务器拒绝访问~',
  404: '404: 请求的资源不存在~',
  405: '405: 请求方法未允许~',
  408: '408: 网络请求超时~',
  500: '500: 服务器内部错误~',
  501: '501: 服务器未实现请求功能~',
  502: '502: 错误网关~',
  503: '503: 服务不可用~',
  504: '504: 网关超时~',
  505: '505: http版本不支持该请求~'
};
type ErrorStatus = 400 | 401 | 403 | 404 | 405 | 408 | 500 | 501 | 502 | 503 | 504 | 505;

/** 错误信息显示时间 */
export const errorDuration = 3000 / 1000;

/**
 * 网络请求错误状态处理
 * @param error - 错误
 */
export function errorHandler(error: any): void {
  if (error.response) {
    const status = error.response.status as ErrorStatus;
    ElMessage.error(ERROR_STATUS[status]);
    return;
  }
  if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
    ElMessage.error('网络连接超时~');
    return;
  }
  if (!window.navigator.onLine || error.message === 'Network Error') {
    ElMessage.error('网络不可用~');
    return;
  }
  ElMessage.error('未知错误~');
}

/**
 * 连续的请求错误依此显示
 * @param duration - 上一次弹出错误消息到下一次的时间(ms)
 */
export function continuousErrorHandler(duration: number) {
  let errorStacks: string[] = [];
  function pushError(id: string) {
    errorStacks.push(id);
  }
  function removeError(id: string) {
    errorStacks = errorStacks.filter(item => item !== id);
  }
  function handleError(id: string, callback: Function) {
    callback();
    setTimeout(() => {
      removeError(id);
    }, duration);
  }

  function handleContinuousError(callback: Function) {
    const id = Date.now().toString(36);
    const { length } = errorStacks;
    if (length > 0) {
      pushError(id);
      setTimeout(() => {
        handleError(id, callback);
      }, duration * length);
    } else {
      pushError(id);
      handleError(id, callback);
    }
  }

  return handleContinuousError;
}
