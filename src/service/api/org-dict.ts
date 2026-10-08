import request from '@/request';
import type { DictCreateDTO, DictItemCreateDTO, DictItemUpdateDTO, DictUpdateDTO } from '@/schema/org-dict';
import type { AuditFields, ManagePage, ManagePageQuery } from './manage-types';

/**
 * 组织 / 字典 / 字典项域 API（P3-03）。
 *
 * 三者放同一文件：后端 schema 也集中在一个 `src/schema/org-dict.ts`，
 * 客户端保持同样的分组，避免 8 个几乎同形的文件。
 */

// ---------------------------------------------------------------------------
// 组织
// ---------------------------------------------------------------------------

/** 组织列表行（org 表） */
export interface OrgRow extends AuditFields {
  id: string;
  enabled: 'Y' | 'N' | 'D';
  parentId: string | null;
  name: string;
  code: string;
  description: string | null;
}

export interface OrgQuery extends ManagePageQuery {
  name?: string;
  code?: string;
}

export function fetchOrgList(query: OrgQuery) {
  return request.get<ManagePage<OrgRow>>('/api/org/list', { query });
}

export function fetchAllOrgs() {
  return request.get<OrgRow[]>('/api/org/all');
}

export function fetchOrgById(id: string) {
  return request.get<OrgRow>(`/api/org/${id}`);
}

export function createOrg(body: { parentId?: string | null; name: string; code: string; description?: string | null }) {
  return request.post<OrgRow>('/api/org', body);
}

export function updateOrg(
  id: string,
  body: { parentId?: string | null; name?: string; code?: string; description?: string | null }
) {
  return request.put<OrgRow>(`/api/org/${id}`, body);
}

export function deleteOrg(id: string) {
  return request.delete<null>(`/api/org/${id}`);
}

export function batchDeleteOrgs(ids: string[]) {
  return request.post<null>('/api/org/batch-delete', { ids });
}

/** 组织角色分配（`PUT /api/org/:id/roles`） */
export function assignOrgRoles(id: string, roleIds: string[]) {
  return request.put<null>(`/api/org/${id}/roles`, { roleIds });
}

/** 组织成员分配（`PUT /api/org/:id/users`） */
export function assignOrgUsers(id: string, userIds: string[]) {
  return request.put<null>(`/api/org/${id}/users`, { userIds });
}

// ---------------------------------------------------------------------------
// 字典
// ---------------------------------------------------------------------------

/** 字典列表行（dict 表） */
export interface DictRow extends AuditFields {
  id: string;
  enabled: 'Y' | 'N' | 'D';
  name: string;
  code: string;
  isSystem: 'Y' | 'N';
  description: string | null;
}

export interface DictQuery extends ManagePageQuery {
  name?: string;
  code?: string;
  isSystem?: 'Y' | 'N';
}

export function fetchDictList(query: DictQuery) {
  return request.get<ManagePage<DictRow>>('/api/dict/list', { query });
}

export function fetchAllDicts() {
  return request.get<DictRow[]>('/api/dict/all');
}

export function fetchDictById(id: string) {
  return request.get<DictRow>(`/api/dict/${id}`);
}

export function createDict(body: DictCreateDTO) {
  return request.post<DictRow>('/api/dict', body);
}

export function updateDict(id: string, body: DictUpdateDTO) {
  return request.put<DictRow>(`/api/dict/${id}`, body);
}

export function deleteDict(id: string) {
  return request.delete<null>(`/api/dict/${id}`);
}

export function batchDeleteDicts(ids: string[]) {
  return request.post<null>('/api/dict/batch-delete', { ids });
}

// ---------------------------------------------------------------------------
// 字典项
// ---------------------------------------------------------------------------

/** 字典项列表行（dict_item 表） */
export interface DictItemRow extends AuditFields {
  id: string;
  enabled: 'Y' | 'N' | 'D';
  dictId: string;
  parentId: string | null;
  label: string;
  value: string;
  order: number;
}

export interface DictItemQuery extends ManagePageQuery {
  dictId?: string;
  label?: string;
  value?: string;
}

export function fetchDictItemList(query: DictItemQuery) {
  return request.get<ManagePage<DictItemRow>>('/api/dict-item/list', { query });
}

export function fetchDictItemById(id: string) {
  return request.get<DictItemRow>(`/api/dict-item/${id}`);
}

export function createDictItem(body: DictItemCreateDTO) {
  return request.post<DictItemRow>('/api/dict-item', body);
}

export function updateDictItem(id: string, body: DictItemUpdateDTO) {
  return request.put<DictItemRow>(`/api/dict-item/${id}`, body);
}

export function deleteDictItem(id: string) {
  return request.delete<null>(`/api/dict-item/${id}`);
}

export function batchDeleteDictItems(ids: string[]) {
  return request.post<null>('/api/dict-item/batch-delete', { ids });
}
