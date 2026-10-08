import request from '@/request';
import type { UserCreateDTO, UserUpdateDTO } from '@/schema/user';
import type { AuditFields, ManagePage, ManagePageQuery } from './manage-types';

/**
 * 用户域 API（P3-03）。
 *
 * 与 `src/service/api/auth.ts` 同范式：openapi 200 响应无 content schema，
 * typed client 推不出响应体，故用 `request.get<手写 DTO>()` 显式标注。
 */

/** 用户列表行（`userService.getUserList` 输出：`stripPassword(row)` + `roles: [{id}]`） */
export interface UserRow extends AuditFields {
  id: string;
  enabled: 'Y' | 'N' | 'D';
  username: string;
  phone: string | null;
  email: string | null;
  fullName: string | null;
  avatar: string | null;
  homePath: string | null;
  description: string | null;
  roles: { id: string }[];
}

/** 用户详情（`GET /api/user/:id` 返回整行，**含 password**，勿透传到 UI） */
export interface UserDetailRow extends AuditFields {
  id: string;
  enabled: 'Y' | 'N' | 'D';
  username: string;
  password: string;
  phone: string | null;
  email: string | null;
  fullName: string | null;
  avatar: string | null;
  homePath: string | null;
  description: string | null;
}

export interface UserQuery extends ManagePageQuery {
  username?: string;
  phone?: string;
  email?: string;
  fullName?: string;
  enabled?: 'Y' | 'N' | 'D';
}

export function fetchUserList(query: UserQuery) {
  return request.get<ManagePage<UserRow>>('/api/user/list', { query });
}

export function fetchUserById(id: string) {
  return request.get<UserDetailRow>(`/api/user/${id}`);
}

export function createUser(body: UserCreateDTO) {
  return request.post<UserDetailRow>('/api/user', body);
}

export function updateUser(id: string, body: UserUpdateDTO) {
  return request.put<UserDetailRow>(`/api/user/${id}`, body);
}

export function deleteUser(id: string) {
  return request.delete<null>(`/api/user/${id}`);
}

export function batchDeleteUsers(ids: string[]) {
  return request.post<null>('/api/user/batch-delete', { ids });
}

/** 替换用户角色（`PUT /api/user/:id/roles`） */
export function assignUserRoles(id: string, roleIds: string[]) {
  return request.put<null>(`/api/user/${id}/roles`, { roleIds });
}

/** 当前用户的角色（`GET /api/role/user`，从 token 取 userId） */
export function fetchCurrentUserRoles() {
  return request.get<{ id: string; name: string; code: string }[]>('/api/role/user');
}
