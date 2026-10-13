import { parse } from 'valibot';
import { hashSync } from 'bcryptjs';
import { DEFAULT_ORDER } from '../constants/db';
import menusSource from '../menus/menus.json';
import { menuSourceFileSchema } from '../schema/menu';
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

/** 菜单源数据（`src/menus/menus.json`，由 `pnpm menu:sync` 与页面文件对账） */
const staticMenus = parse(menuSourceFileSchema, menusSource).menus;
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

/**
 * 菜单种子 = 仓库里的菜单源数据（`src/menus/menus.json`），不在这里另写一份。
 *
 * 为什么必须同源（`docs/v3-menu-route-modes.md` §4.2）：菜单有两份就必然漂移。
 * 改造前这里手写着 6 行 `routeName: 'home' / 'system_user'`（legacy elegant-router
 * 的命名）与 `routeComponent: 'layout.base$view.home'`（指向已不存在的 `src/views`），
 * 而真实页面早就叫 `Index` / `ManageUserIndex`（`src/pages/manage/user/index.vue`）
 * —— two sources, guaranteed drift。现在 static 模式读同一份 JSON，seed 读这一份，
 * 漂移在结构上不可能发生。
 */
export const seedMenus: NewMenu[] = staticMenus.map(row => ({
  ...row,
  // 源文件里可省/可为 null 的字段，入库前补成 DB 的 NOT NULL 默认值
  requiresAuth: row.requiresAuth ?? 'Y',
  order: row.order ?? DEFAULT_ORDER,
  keepAlive: row.keepAlive ?? 'N',
  multiTab: row.multiTab ?? 'N',
  pinned: row.pinned ?? 'N',
  // id 来自菜单源文件，不交给 drizzle 的 $defaultFn；审计字段统一补
  enabled: 'Y',
  ...idRow()
}));

/** 权限：按钮权限（挂菜单）+ API 权限（挂 API 记录） */
export const seedPermissions: NewPermission[] = [
  {
    id: 'P_system_user_add',
    name: '新增用户',
    code: 'system:user:add',
    resourceType: 'menu',
    resourceId: 'M_manage_user_index',
    ...idRow()
  },
  {
    id: 'P_system_user_edit',
    name: '编辑用户',
    code: 'system:user:edit',
    resourceType: 'menu',
    resourceId: 'M_manage_user_index',
    ...idRow()
  },
  {
    id: 'P_system_user_delete',
    name: '删除用户',
    code: 'system:user:delete',
    resourceType: 'menu',
    resourceId: 'M_manage_user_index',
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

// 关联表行 id 必须确定性（不能用 createUuidV7 随机生成！）：seed 靠
// INSERT OR IGNORE 幂等，随机 id 永不冲突 → 每次启动重复累积一行
//（叠加 0002 迁移的自然键唯一索引，双保险）。
export const seedUserRoles = [
  { id: `ur_${'U_admin'}_${ROLE_SUPER}`, userId: 'U_admin', roleId: ROLE_SUPER, ...auditRow() },
  { id: `ur_${'U_user'}_${ROLE_USER}`, userId: 'U_user', roleId: ROLE_USER, ...auditRow() }
];

export const seedRolePermissions = [
  // super 全量权限
  ...seedPermissions.map(p => ({
    id: `rp_${ROLE_SUPER}_${p.id!}`,
    roleId: ROLE_SUPER,
    permissionId: p.id!,
    ...auditRow()
  })),
  // user：公开菜单 + 自身菜单 + 自身角色（登录后渲染用）
  { id: 'rp_R_user_P_api_menu_public', roleId: ROLE_USER, permissionId: 'P_api_menu_public', ...auditRow() },
  { id: 'rp_R_user_P_api_menu_user', roleId: ROLE_USER, permissionId: 'P_api_menu_user', ...auditRow() },
  { id: 'rp_R_user_P_api_role_user', roleId: ROLE_USER, permissionId: 'P_api_role_user', ...auditRow() }
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
