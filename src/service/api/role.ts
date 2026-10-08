import request from '@/request';
import type { RoleCreateDTO, RoleUpdateDTO } from '@/schema/role';
import type { AuditFields, ManagePage, ManagePageQuery } from './manage-types';

/**
 * 角色域 API（P3-03）。
 */

/** 角色列表行（`roleService.getRoleList` 输出：行 + `userCount`） */
export interface RoleRow extends AuditFields {
  id: string;
  enabled: 'Y' | 'N' | 'D';
  name: string;
  code: string;
  description: string | null;
  userCount: number;
}

/** 角色详情（`GET /api/role/:id` = `getRoleDetailById`） */
export interface RoleDetail extends AuditFields {
  id: string;
  enabled: 'Y' | 'N' | 'D';
  name: string;
  code: string;
  description: string | null;
  permissions: { id: string; name: string | null; code: string | null }[];
}

/** `GET /api/role/all` 行（无 userCount） */
export interface RoleOptionRow {
  id: string;
  name: string;
  code: string;
  enabled: 'Y' | 'N' | 'D';
}

export interface RoleQuery extends ManagePageQuery {
  name?: string;
  code?: string;
  enabled?: 'Y' | 'N' | 'D';
}

export function fetchRoleList(query: RoleQuery) {
  return request.get<ManagePage<RoleRow>>('/api/role/list', { query });
}

export function fetchAllRoles() {
  return request.get<RoleOptionRow[]>('/api/role/all');
}

export function fetchRoleById(id: string) {
  return request.get<RoleDetail>(`/api/role/${id}`);
}

export function createRole(body: RoleCreateDTO) {
  return request.post<RoleRow>('/api/role', body);
}

export function updateRole(id: string, body: RoleUpdateDTO) {
  return request.put<RoleRow>(`/api/role/${id}`, body);
}

export function deleteRole(id: string) {
  return request.delete<null>(`/api/role/${id}`);
}

export function batchDeleteRoles(ids: string[]) {
  return request.post<null>('/api/role/batch-delete', { ids });
}

/** 替换角色权限（`PUT /api/role/:id/permissions`） */
export function assignRolePermissions(id: string, permissionIds: string[]) {
  return request.put<null>(`/api/role/${id}/permissions`, { permissionIds });
}
