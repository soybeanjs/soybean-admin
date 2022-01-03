import qs from 'qs';
import FormData from 'form-data';
import { ContentType } from '@/enum';
import { isArray } from '../common';

/**
 * 请求数据的转换
 * @param requestData - 请求数据
 * @param contentType - 请求头的Content-Type
 */
export async function transformRequestData(requestData: any, contentType?: string) {
  // application/json类型不处理
  let data = requestData;
  // form类型转换
  if (contentType === ContentType.formUrlencoded) {
    data = qs.stringify(requestData);
  }
  // form-data类型转换
  if (contentType === ContentType.formData) {
    const key = Object.keys(requestData)[0];
    const file = requestData.data[key];
    data = await transformFile(file, key);
  }
  return data;
}

/**
 * 接口为上传文件的类型时数据转换
 * @param file - 单文件或多文件
 * @param key - 文件的属性名
 */
async function transformFile(file: File[] | File, key: string) {
  const formData = new FormData();
  if (isArray(file)) {
    // 多文件
    await Promise.all(
      (file as File[]).map(item => {
        formData.append(key, item);
        return true;
      })
    );
  } else {
    // 单文件
    await formData.append(key, file);
  }
  return formData;
}
