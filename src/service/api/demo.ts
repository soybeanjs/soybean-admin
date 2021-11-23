import { requestMiddleware } from '@/utils';
import type { ResponseDictionary, Dictionary } from '@/interface';
import { request } from '../request';
import { fecthDictionaryMiddleware } from '../middleware';

// 接口示例

/**
 * 获取数据字典(不加middleware处理)
 * @param keyword - 关键词
 */
export function fetchDictionary(keyword: string) {
  return request.post<ResponseDictionary[]>('/emoss-entropy/ehe/model/getByIndicator', {
    indiCatorName: keyword
  });
}

/**
 * 获取数据字典(加middleware处理)
 * @param keyword - 关键词
 */
export async function fetchDictionaryWithMiddleware(keyword: string) {
  const res = await request.post<ResponseDictionary[]>('/emoss-entropy/ehe/model/getByIndicator', {
    indiCatorName: keyword
  });

  return requestMiddleware<Dictionary[]>(fecthDictionaryMiddleware, [res]);
}
