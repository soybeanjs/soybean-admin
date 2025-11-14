import { request } from '@/service/request';

/** 获取部门树列表 */
export function fetchGetDeptTree() {
  return request<Api.Common.CommonTreeRecord>({
    url: '/dept/tree',
    method: 'get'
  });
}
