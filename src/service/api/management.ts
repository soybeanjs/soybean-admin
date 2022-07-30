import { adapter } from '@/utils';
import { mockRequest } from '../request';
import { adapterOfFetchUserManagementList } from './management.adapter';

/**
 * 获取用户管理列表
 */
export async function fetchUserManagementList() {
  const data = await mockRequest.post<ApiUserManagement.UserTable[]>('/getUserManagementList');

  const id = '2';

  return adapter(adapterOfFetchUserManagementList, data, { error: null, data: id });
}

// export async function fetchFilterUserManagementList(
//   filterKey: keyof UserManagement.UserTable,
//   mode: 'fontEnd' | 'backEnd',
//   source: UserManagement.UserTable[]
// ) {

// }
