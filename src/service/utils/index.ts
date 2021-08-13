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
