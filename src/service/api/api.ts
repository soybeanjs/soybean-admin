import type { ManageApiMethod } from '@/constants/manage';
import request from '@/request';
import type { ApiCreateDTO, ApiUpdateDTO } from '@/schema/api';
import type { AuditFields, ManagePage, ManagePageQuery } from './manage-types';

/**
 * 接口资源域 API（P3-03）。
 */

/** 接口列表行（`apiService` 的 api 表行） */
export interface ApiRow extends AuditFields {
  id: string;
  enabled: 'Y' | 'N' | 'D';
  name: string;
  path: string;
  method: ManageApiMethod;
  description: string | null;
}

export interface ApiQuery extends ManagePageQuery {
  name?: string;
  path?: string;
  method?: string;
}

export function fetchApiList(query: ApiQuery) {
  return request.get<ManagePage<ApiRow>>('/api/api/list', { query });
}

export function fetchAllApis() {
  return request.get<ApiRow[]>('/api/api/all');
}

export function fetchApiById(id: string) {
  return request.get<ApiRow>(`/api/api/${id}`);
}

export function createApi(body: ApiCreateDTO) {
  return request.post<ApiRow>('/api/api', body);
}

export function updateApi(id: string, body: ApiUpdateDTO) {
  return request.put<ApiRow>(`/api/api/${id}`, body);
}

export function deleteApi(id: string) {
  return request.delete<null>(`/api/api/${id}`);
}

export function batchDeleteApis(ids: string[]) {
  return request.post<null>('/api/api/batch-delete', { ids });
}
