import request from '@/request';
import type { ApiMenuRow } from '@/typings/app';

/**
 * 菜单域 API（v3 §5.3，dynamic 路由模式数据源）。
 */

/** 当前用户可见菜单（enabled 且经权限过滤，含祖先链，平铺） */
export function fetchGetUserMenus() {
  return request.get<ApiMenuRow[]>('/api/menu/user');
}

/** 路由存在性检查（NotFound 403/404 判定） */
export function fetchIsRouteExist(query: { routeName?: string; routePath?: string }) {
  return request.post<{ exists: boolean }>('/api/menu/exist-path', query);
}
