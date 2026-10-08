import type { ApiRow } from '@/service/api/api';
import type { MenuRow } from '@/service/api/menu-manage';
import type { DictItemRow, DictRow, OrgRow } from '@/service/api/org-dict';
import type { PermissionRow } from '@/service/api/permission';
import type { RoleDetail } from '@/service/api/role';
import type { UserDetailRow } from '@/service/api/user';
import type {
  ApiFormDTO,
  DictFormDTO,
  DictItemFormDTO,
  MenuFormDTO,
  OrgFormDTO,
  PermissionFormDTO,
  RoleFormDTO,
  UserFormDTO
} from './form';

/**
 * operate 弹窗的默认值与"行 → 表单值"映射（P3-03）。
 *
 * 这一层是刻意单独的：`@vean/ui` 的 `useForm` 通过 `form.reset(values)` 回填
 * （它会把 `defaultValues` 一并替换成新值），所以"新增空表"和"编辑回填"共用
 * 同一条路径 —— 只要给出两种取值即可。
 *
 * `null` → 空串：`SInput` / `SSelect` 的 `modelValue` 是 `string`，收 `null`
 * 会退化成非受控；表单一律用空串表达"未填"，提交时再还原成 `null`。
 */

/** 行可选字段 → 表单字符串 */
function text(value: string | null | undefined): string {
  return value ?? '';
}

/* -------------------------------------------------------------------------- */
/*                                    用户                                     */
/* -------------------------------------------------------------------------- */

export const emptyUserForm: UserFormDTO = {
  username: '',
  password: '',
  fullName: '',
  phone: '',
  email: '',
  homePath: '/home',
  enabled: 'Y',
  roleIds: []
};

export function toUserForm(row: UserDetailRow & { roles?: { id: string }[] }): UserFormDTO {
  return {
    username: row.username,
    password: '',
    fullName: text(row.fullName),
    phone: text(row.phone),
    email: text(row.email),
    homePath: text(row.homePath) || '/home',
    enabled: row.enabled,
    roleIds: row.roles?.map(role => role.id) ?? []
  };
}

/* -------------------------------------------------------------------------- */
/*                                    角色                                     */
/* -------------------------------------------------------------------------- */

export const emptyRoleForm: RoleFormDTO = {
  name: '',
  code: '',
  description: null,
  enabled: 'Y',
  permissionIds: []
};

export function toRoleForm(row: RoleDetail): RoleFormDTO {
  return {
    name: row.name,
    code: row.code,
    description: row.description,
    enabled: row.enabled,
    permissionIds: row.permissions.map(permission => permission.id)
  };
}

/* -------------------------------------------------------------------------- */
/*                                    接口                                     */
/* -------------------------------------------------------------------------- */

export const emptyApiForm: ApiFormDTO = {
  name: '',
  path: '',
  method: 'get',
  description: null
};

export function toApiForm(row: ApiRow): ApiFormDTO {
  return {
    name: row.name,
    path: row.path,
    method: row.method,
    description: row.description
  };
}

/* -------------------------------------------------------------------------- */
/*                                    组织                                     */
/* -------------------------------------------------------------------------- */

export const emptyOrgForm: OrgFormDTO = {
  parentId: null,
  name: '',
  code: '',
  description: null
};

export function toOrgForm(row: OrgRow): OrgFormDTO {
  return {
    parentId: row.parentId,
    name: row.name,
    code: row.code,
    description: row.description
  };
}

/* -------------------------------------------------------------------------- */
/*                                    字典                                     */
/* -------------------------------------------------------------------------- */

export const emptyDictForm: DictFormDTO = {
  name: '',
  code: '',
  isSystem: 'N',
  description: null
};

export function toDictForm(row: DictRow): DictFormDTO {
  return {
    name: row.name,
    code: row.code,
    isSystem: row.isSystem,
    description: row.description
  };
}

export const emptyDictItemForm: DictItemFormDTO = {
  dictId: '',
  parentId: null,
  label: '',
  value: '',
  order: 0
};

export function toDictItemForm(row: DictItemRow): DictItemFormDTO {
  return {
    dictId: row.dictId,
    parentId: row.parentId,
    label: row.label,
    value: row.value,
    order: row.order
  };
}

/* -------------------------------------------------------------------------- */
/*                                    权限                                     */
/* -------------------------------------------------------------------------- */

export const emptyPermissionForm: PermissionFormDTO = {
  name: '',
  code: '',
  resourceType: 'other',
  resourceId: null,
  enabled: 'Y',
  description: null
};

export function toPermissionForm(row: PermissionRow): PermissionFormDTO {
  return {
    name: text(row.name),
    code: text(row.code),
    resourceType: row.resourceType,
    resourceId: row.resourceId,
    enabled: row.enabled,
    description: row.description
  };
}

/* -------------------------------------------------------------------------- */
/*                                    菜单                                     */
/* -------------------------------------------------------------------------- */

export const emptyMenuForm: MenuFormDTO = {
  parentId: null,
  menuType: 'menu',
  name: '',
  code: '',
  requiresAuth: 'Y',
  enabled: 'Y',
  icon: '',
  i18nKey: '',
  order: 0,
  iframeUrl: '',
  href: '',
  keepAlive: 'N',
  multiTab: 'N',
  pinned: 'N',
  routeName: '',
  routePath: '',
  routeLayout: '',
  routeComponent: '',
  routeRedirect: '',
  routeQueries: {},
  routeParams: {},
  description: null
};

export function toMenuForm(row: MenuRow): MenuFormDTO {
  return {
    parentId: row.parentId,
    menuType: row.menuType,
    name: row.name,
    code: row.code,
    requiresAuth: row.requiresAuth,
    enabled: row.enabled,
    icon: text(row.icon),
    i18nKey: text(row.i18nKey),
    order: row.order,
    iframeUrl: text(row.iframeUrl),
    href: text(row.href),
    keepAlive: row.keepAlive,
    multiTab: row.multiTab,
    pinned: row.pinned,
    routeName: text(row.routeName),
    routePath: text(row.routePath),
    routeLayout: text(row.routeLayout),
    routeComponent: text(row.routeComponent),
    routeRedirect: text(row.routeRedirect),
    routeQueries: row.routeQueries ?? {},
    routeParams: row.routeParams ?? {},
    description: row.description
  };
}
