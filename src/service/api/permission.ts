import request from '@/request';
import type { PermissionCreateDTO, PermissionUpdateDTO } from '@/schema/permission';
import type { AuditFields, ManagePage, ManagePageQuery } from './manage-types';

/**
 * 权限点域 API（P3-03）。
 *
 * 权限码约定（`src/services/permission.service.ts` 头注释）：
 * - API：`api:${method.toLowerCase()}:(${path})`
 * - 菜单/按钮：`menu:${menuType}:${code}`
 * - 其他：直接用 `code`
 */

/** 权限资源类型 */
export type PermissionResourceType = 'menu' | 'api' | 'button' | 'other';

/** 权限列表行（permission 表） */
export interface PermissionRow extends AuditFields {
  id: string;
  enabled: 'Y' | 'N' | 'D';
  name: string;
  code: string;
  resourceType: PermissionResourceType;
  resourceId: string | null;
  description: string | null;
}

export interface PermissionQuery extends ManagePageQuery {
  name?: string;
  code?: string;
  resourceType?: PermissionResourceType;
  enabled?: 'Y' | 'N' | 'D';
}

export function fetchPermissionList(query: PermissionQuery) {
  return request.get<ManagePage<PermissionRow>>('/api/permission/list', { query });
}

export function fetchAllPermissions() {
  return request.get<PermissionRow[]>('/api/permission/all');
}

export function fetchPermissionById(id: string) {
  return request.get<PermissionRow>(`/api/permission/${id}`);
}

export function createPermission(body: PermissionCreateDTO) {
  return request.post<PermissionRow>('/api/permission', body);
}

export function updatePermission(id: string, body: PermissionUpdateDTO) {
  return request.put<PermissionRow>(`/api/permission/${id}`, body);
}

export function deletePermission(id: string) {
  return request.delete<null>(`/api/permission/${id}`);
}

export function batchDeletePermissions(ids: string[]) {
  return request.post<null>('/api/permission/batch-delete', { ids });
}

/** 某角色已绑定的权限（`GET /api/permission/role/:id`） */
export function fetchRolePermissions(roleId: string) {
  return request.get<PermissionRow[]>(`/api/permission/role/${roleId}`);
}
