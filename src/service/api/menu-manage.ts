import request from '@/request';
import type { MenuCreateDTO, MenuUpdateDTO } from '@/schema/menu';
import type { AuditFields, ManagePage, ManagePageQuery } from './manage-types';

/**
 * 菜单域 API（P3-03 管理页；dynamic 路由数据源见 `src/service/api/menu.ts`）。
 */

/** 菜单行（menu 表） */
export interface MenuRow extends AuditFields {
  id: string;
  enabled: 'Y' | 'N' | 'D';
  parentId: string | null;
  name: string;
  code: string;
  menuType: 'directory' | 'menu' | 'page' | 'iframe' | 'link' | 'button' | 'other';
  requiresAuth: 'Y' | 'N';
  icon: string | null;
  i18nKey: string | null;
  order: number;
  iframeUrl: string | null;
  href: string | null;
  routePath: string | null;
  routeName: string | null;
  routeLayout: string | null;
  routeComponent: string | null;
  routeRedirect: string | null;
  routeQueries: Record<string, string> | null;
  routeParams: Record<string, string> | null;
  keepAlive: 'Y' | 'N';
  multiTab: 'Y' | 'N';
  pinned: 'Y' | 'N';
  description: string | null;
}

/** 菜单树节点（`GET /api/menu/tree`） */
export interface MenuTreeRow extends MenuRow {
  children?: MenuTreeRow[];
}

export interface MenuQuery extends ManagePageQuery {
  menuType?: MenuRow['menuType'];
  name?: string;
  code?: string;
  parentId?: string;
  requiresAuth?: 'Y' | 'N';
  enabled?: 'Y' | 'N' | 'D';
}

export function fetchMenuList(query: MenuQuery) {
  return request.get<ManagePage<MenuRow>>('/api/menu/list', { query });
}

export function fetchMenuTree() {
  return request.get<MenuTreeRow[]>('/api/menu/tree');
}

export function fetchAllMenus() {
  return request.get<MenuRow[]>('/api/menu/all');
}

export function fetchMenuById(id: string) {
  return request.get<MenuRow>(`/api/menu/${id}`);
}

export function createMenu(body: MenuCreateDTO) {
  return request.post<MenuRow>('/api/menu', body);
}

export function updateMenu(id: string, body: MenuUpdateDTO) {
  return request.put<MenuRow>(`/api/menu/${id}`, body);
}

export function deleteMenu(id: string) {
  return request.delete<null>(`/api/menu/${id}`);
}

export function batchDeleteMenus(ids: string[]) {
  return request.post<null>('/api/menu/batch-delete', { ids });
}
