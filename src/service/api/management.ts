import { adapter } from '@/utils';
import { mockRequest } from '../request';
import { adapterOfFetchUserManagementList } from './management.adapter';

/**
 * 获取用户管理列表
 */
export async function fetchUserManagementList() {
  const data = await mockRequest.post<ApiUserManagement.UserTable[]>('/getUserManagementList');

  return adapter(adapterOfFetchUserManagementList, data);
}
