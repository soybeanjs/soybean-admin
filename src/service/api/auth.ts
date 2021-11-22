import { request } from '../request';

/**
 * 获取数据字典
 */
export async function fetchDictionary(keyword: string) {
  await request.post('/ehe/model/getByIndicator', { indiCatorName: keyword });
}
