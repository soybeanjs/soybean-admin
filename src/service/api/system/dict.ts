import { request } from '@/service/request';

/** 根据字典类型查询字典数据信息 */
export function fetchGetDictDataByType(dictType: string) {
  return request<Api.System.DictData[]>({
    url: `/dict/data/type/${dictType}`,
    method: 'get'
  });
}
