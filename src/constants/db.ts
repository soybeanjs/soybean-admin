/** 默认审计字段值（P1-08 数据模型约定） */
export const DEFAULT_CREATED_BY = 'system';

export const DEFAULT_UPDATED_BY = 'system';

/** 用户默认首页路径 */
export const DEFAULT_HOME_PATH = '/home';

/** 权限资源类型默认值（不绑定具体资源） */
export const DEFAULT_RESOURCE_TYPE = 'other';

/** 菜单类权限的 resourceType（RBAC 菜单授权用） */
export const MENU_OF_PERMISSION_RESOURCE_TYPE = 'menu';

/** API 类权限的 resourceType（RBAC 接口鉴权用） */
export const API_OF_PERMISSION_RESOURCE_TYPE = 'api';

/** 菜单默认排序值 */
export const DEFAULT_ORDER = 999;

/** 权限码前缀（RBAC 中间件按 `api:${method}:${path}` 匹配） */
export const API_PERMISSION_PREFIX = 'api';
