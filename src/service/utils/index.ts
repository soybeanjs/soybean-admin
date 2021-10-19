import FormData from 'form-data';
import { isArray } from '@/utils';

type HandleFunc<T> = (...arg: any) => T;
type RequestError = any;
type RequestData = any;
type RequestResult = [RequestError, RequestData];
/**
 * 对请求的结果数据进行格式化的处理
 * @param handleFunc - 处理函数
 * @param requests - 请求结果
 */
export function handleResponse<T>(handleFunc: HandleFunc<T>, ...requests: RequestResult[]) {
  let handleData: any = null;
  let error: any = null;
  const hasError = requests.some(item => {
    const isError = Boolean(item[0]);
    if (isError) {
      [error] = item;
    }
    return isError;
  });
  if (!hasError) {
    handleData = handleFunc(...requests.map(item => item[1]));
  }
  return [error, handleData] as [any, T];
}

/**
 * 接口为上传文件的类型时数据转换
 * @param file - 单文件或多文件
 * @param key - 文件的属性名
 */
export async function transformFile(file: File[] | File, key: string) {
  const formData = new FormData();
  if (isArray(file)) {
    await Promise.all(
      (file as File[]).map(item => {
        formData.append(key, item);
        return true;
      })
    );
  } else {
    await formData.append(key, file);
  }
  return formData;
}

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
type ErrorStatus = keyof typeof ERROR_STATUS;

/**
 * 网络请求错误状态处理
 * @param error - 错误
 */
export function errorHandler(error: any): void {
  const { $message: Message } = window;
  if (error.response) {
    const status = error.response.status as ErrorStatus;
    Message?.error(ERROR_STATUS[status]);
    return;
  }
  if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
    Message?.error('网络连接超时~');
    return;
  }
  if (!window.navigator.onLine || error.message === 'Network Error') {
    Message?.error('网络不可用~');
    return;
  }
  Message?.error('请求错误~');
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
