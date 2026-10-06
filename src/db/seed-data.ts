import { hashSync } from 'bcryptjs';
import { createUuidV7 } from '../shared/uuid';
import type { NewApi } from './schema/api';
import type { NewDict } from './schema/dict';
import type { NewDictItem } from './schema/dict-item';
import type { NewMenu } from './schema/menu';
import type { NewPermission } from './schema/permission';
import type { NewRole } from './schema/role';
import type { NewUser } from './schema/user';

/**
 * Seed 数据（v3 §6.2：dev 默认库带演示数据）。
 *
 * - 超级管理员 admin / 123456、普通用户 user / 123456（bcrypt 现场生成）；
 * - 菜单树（目录/菜单 + 按钮）+ 权限码 + API 清单 + 字典；
 * - 权限码范式 `api:${method}:(/${path})`，与 RBAC 中间件一致；
 * - 固定主键（U_/R_/M_/P_/A_/D_/DI_ 前缀）保证幂等与关系稳定。
 */

function auditRow() {
  const time = new Date().toISOString().slice(0, 19).replace('T', ' ');

  return { createdBy: 'seed', createdTime: time, updatedBy: 'seed', updatedTime: time };
}

function idRow() {
  // 仅审计字段——固定主键（U_/R_/M_/P_/A_/D_/DI_ 前缀）由各行显式给出，保证关系稳定
  return { ...auditRow() };
}

const ROLE_SUPER = 'R_super';
const ROLE_USER = 'R_user';

export const seedUsers: NewUser[] = [
  {
    id: 'U_admin',
    username: 'admin',
    password: hashSync('123456', 10),
    fullName: '超级管理员',
    email: 'admin@example.com',
    homePath: '/',
    ...idRow()
  },
  {
    id: 'U_user',
    username: 'user',
    password: hashSync('123456', 10),
    fullName: '普通用户',
    email: 'user@example.com',
    ...idRow()
  }
];

export const seedRoles: NewRole[] = [
  { id: ROLE_SUPER, name: '超级管理员', code: 'super', description: '拥有全部权限', ...idRow() },
  { id: ROLE_USER, name: '普通用户', code: 'user', description: '仅可访问公开页面', ...idRow() }
];

export const seedMenus: NewMenu[] = [
  {
    id: 'M_home',
    name: '首页',
    code: 'M_home',
    menuType: 'menu',
    requiresAuth: 'Y',
    routePath: '/',
    routeName: 'home',
    routeComponent: 'layout.base$view.home',
    i18nKey: 'route.home',
    icon: 'mdi:monitor-dashboard',
    order: 100,
    ...idRow()
  },
  {
    id: 'M_system',
    name: '系统管理',
    code: 'M_system',
    menuType: 'directory',
    requiresAuth: 'Y',
    routePath: '/system',
    routeName: 'system',
    i18nKey: 'route.system',
    icon: 'mdi:settings-outline',
    order: 200,
    ...idRow()
  },
  {
    id: 'M_system_user',
    parentId: 'M_system',
    name: '用户管理',
    code: 'M_system_user',
    menuType: 'menu',
    requiresAuth: 'Y',
    routePath: '/system/user',
    routeName: 'system_user',
    routeComponent: 'layout.base$view.system_user',
    i18nKey: 'route.system_user',
    order: 1,
    ...idRow()
  },
  {
    id: 'M_system_role',
    parentId: 'M_system',
    name: '角色管理',
    code: 'M_system_role',
    menuType: 'menu',
    requiresAuth: 'Y',
    routePath: '/system/role',
    routeName: 'system_role',
    routeComponent: 'layout.base$view.system_role',
    i18nKey: 'route.system_role',
    order: 2,
    ...idRow()
  },
  {
    id: 'M_system_menu',
    parentId: 'M_system',
    name: '菜单管理',
    code: 'M_system_menu',
    menuType: 'menu',
    requiresAuth: 'Y',
    routePath: '/system/menu',
    routeName: 'system_menu',
    routeComponent: 'layout.base$view.system_menu',
    i18nKey: 'route.system_menu',
    order: 3,
    ...idRow()
  },
  {
    id: 'M_about',
    name: '关于',
    code: 'M_about',
    menuType: 'menu',
    requiresAuth: 'N',
    routePath: '/about',
    routeName: 'about',
    routeComponent: 'layout.base$view.about',
    i18nKey: 'route.about',
    icon: 'mdi:information-outline',
    order: 900,
    ...idRow()
  }
];

/** 权限：按钮权限（挂菜单）+ API 权限（挂 API 记录） */
export const seedPermissions: NewPermission[] = [
  {
    id: 'P_system_user_add',
    name: '新增用户',
    code: 'system:user:add',
    resourceType: 'menu',
    resourceId: 'M_system_user',
    ...idRow()
  },
  {
    id: 'P_system_user_edit',
    name: '编辑用户',
    code: 'system:user:edit',
    resourceType: 'menu',
    resourceId: 'M_system_user',
    ...idRow()
  },
  {
    id: 'P_system_user_delete',
    name: '删除用户',
    code: 'system:user:delete',
    resourceType: 'menu',
    resourceId: 'M_system_user',
    ...idRow()
  },
  {
    id: 'P_api_user_list',
    name: '用户列表接口',
    code: 'api:get:(/user/list)',
    resourceType: 'api',
    resourceId: 'A_user_list',
    ...idRow()
  },
  {
    id: 'P_api_user_add',
    name: '新增用户接口',
    code: 'api:post:(/user)',
    resourceType: 'api',
    resourceId: 'A_user_add',
    ...idRow()
  },
  {
    id: 'P_api_role_list',
    name: '角色列表接口',
    code: 'api:get:(/role/list)',
    resourceType: 'api',
    resourceId: 'A_role_list',
    ...idRow()
  },
  {
    id: 'P_api_menu_public',
    name: '公开菜单接口',
    code: 'api:get:(/menu/public)',
    resourceType: 'api',
    resourceId: 'A_menu_public',
    ...idRow()
  },
  {
    id: 'P_api_menu_user',
    name: '用户菜单接口',
    code: 'api:get:(/menu/user)',
    resourceType: 'api',
    resourceId: 'A_menu_user',
    ...idRow()
  },
  {
    id: 'P_api_role_user',
    name: '用户角色接口',
    code: 'api:get:(/role/user)',
    resourceType: 'api',
    resourceId: 'A_role_user',
    ...idRow()
  }
];

export const seedUserRoles = [
  { id: createUuidV7(), userId: 'U_admin', roleId: ROLE_SUPER, ...auditRow() },
  { id: createUuidV7(), userId: 'U_user', roleId: ROLE_USER, ...auditRow() }
];

export const seedRolePermissions = [
  // super 全量权限
  ...seedPermissions.map(p => ({ id: createUuidV7(), roleId: ROLE_SUPER, permissionId: p.id!, ...auditRow() })),
  // user：公开菜单 + 自身菜单 + 自身角色（登录后渲染用）
  { id: createUuidV7(), roleId: ROLE_USER, permissionId: 'P_api_menu_public', ...auditRow() },
  { id: createUuidV7(), roleId: ROLE_USER, permissionId: 'P_api_menu_user', ...auditRow() },
  { id: createUuidV7(), roleId: ROLE_USER, permissionId: 'P_api_role_user', ...auditRow() }
];

export const seedApis: NewApi[] = [
  { id: 'A_auth_login', name: '登录', path: '/auth/login', method: 'post', ...idRow() },
  { id: 'A_auth_register', name: '注册', path: '/auth/register', method: 'post', ...idRow() },
  { id: 'A_auth_refresh', name: '刷新令牌', path: '/auth/token/refresh', method: 'post', ...idRow() },
  { id: 'A_auth_logout', name: '登出', path: '/auth/logout', method: 'post', ...idRow() },
  { id: 'A_auth_user_info', name: '当前用户信息', path: '/auth/user-info', method: 'get', ...idRow() },
  { id: 'A_menu_public', name: '公开菜单', path: '/menu/public', method: 'get', ...idRow() },
  { id: 'A_menu_user', name: '用户菜单', path: '/menu/user', method: 'get', ...idRow() },
  { id: 'A_menu_exist', name: '路由存在性', path: '/menu/exist-path', method: 'post', ...idRow() },
  { id: 'A_user_list', name: '用户列表', path: '/user/list', method: 'get', ...idRow() },
  { id: 'A_user_add', name: '新增用户', path: '/user', method: 'post', ...idRow() },
  { id: 'A_role_user', name: '用户角色', path: '/role/user', method: 'get', ...idRow() },
  { id: 'A_role_list', name: '角色列表', path: '/role/list', method: 'get', ...idRow() },
  { id: 'A_role_add', name: '新增角色', path: '/role', method: 'post', ...idRow() },
  { id: 'A_menu_list', name: '菜单列表', path: '/menu/list', method: 'get', ...idRow() },
  { id: 'A_permission_list', name: '权限列表', path: '/permission/list', method: 'get', ...idRow() },
  { id: 'A_api_list', name: 'API 列表', path: '/api-resource/list', method: 'get', ...idRow() },
  { id: 'A_org_list', name: '组织列表', path: '/org/list', method: 'get', ...idRow() },
  { id: 'A_dict_list', name: '字典列表', path: '/dict/list', method: 'get', ...idRow() },
  { id: 'A_dict_item_list', name: '字典项列表', path: '/dict-item/list', method: 'get', ...idRow() }
];

export const seedDicts: NewDict[] = [
  { id: 'D_gender', name: '性别', code: 'gender', isSystem: 'Y', ...idRow() },
  { id: 'D_status', name: '启用状态', code: 'status', isSystem: 'Y', ...idRow() }
];

export const seedDictItems: NewDictItem[] = [
  { id: 'DI_male', dictId: 'D_gender', label: '男', value: '1', order: 1, ...idRow() },
  { id: 'DI_female', dictId: 'D_gender', label: '女', value: '2', order: 2, ...idRow() },
  { id: 'DI_unknown', dictId: 'D_gender', label: '未知', value: '0', order: 3, ...idRow() },
  { id: 'DI_enabled', dictId: 'D_status', label: '启用', value: 'Y', order: 1, ...idRow() },
  { id: 'DI_disabled', dictId: 'D_status', label: '停用', value: 'N', order: 2, ...idRow() }
];
