import { describe, expect, it } from 'vitest';
import * as v from 'valibot';
import { apiMethodSchema, enabledSchema, menuTypeSchema } from './shared';
import {
  MANAGE_FORM_SCHEMAS,
  apiFormSchema,
  dictFormSchema,
  dictItemFormSchema,
  menuFormSchema,
  orgFormSchema,
  permissionFormSchema,
  roleFormSchema,
  userFormSchema
} from './form';
import {
  emptyApiForm,
  emptyDictForm,
  emptyDictItemForm,
  emptyMenuForm,
  emptyOrgForm,
  emptyPermissionForm,
  emptyRoleForm,
  emptyUserForm
} from './form-defaults';

/**
 * 表单 schema 护栏（P3-03）。
 *
 * 8 套 operate 表单的"schema 加了字段、默认值忘了加"是个静默失败：`useForm`
 * 的 `defaultValues` 少一个键，该键的 `SFormField` 渲染出来就是空且不受控，
 * 只有手点进弹窗才会发现。这里把两件事变成测试：
 * 1. 每个表单的**默认值与 schema 键集合完全一致**（多/少都报错）；
 * 2. 枚举字段复用 `src/schema/shared.ts` 的**同一个 schema 对象**
 *    （值域若抄两份，会表现成"前端能选、后端 3000"）。
 */

/** 从 valibot 对象 schema 上取 `entries` 字段（无断言，靠 `in` + `typeof` 收窄） */
function readEntries(schema: unknown): object | undefined {
  if (typeof schema !== 'object' || schema === null || !('entries' in schema)) return undefined;

  const { entries } = schema;

  return typeof entries === 'object' && entries !== null ? entries : undefined;
}

/** 对象 schema 的键集合（`entries` 是 valibot 对象 schema 的稳定结构字段） */
function schemaKeys(schema: unknown): string[] {
  return Object.keys(readEntries(schema) ?? {}).sort();
}

/** 取对象 schema 的某个字段 schema（用于断言“复用了同一个对象”） */
function schemaEntry(schema: unknown, key: string): unknown {
  return Object.entries(readEntries(schema) ?? {}).find(([name]) => name === key)?.[1];
}

const FORM_CASES: { name: string; schema: unknown; values: Record<string, unknown> }[] = [
  { name: 'user', schema: userFormSchema, values: emptyUserForm },
  { name: 'role', schema: roleFormSchema, values: emptyRoleForm },
  { name: 'api', schema: apiFormSchema, values: emptyApiForm },
  { name: 'org', schema: orgFormSchema, values: emptyOrgForm },
  { name: 'dict', schema: dictFormSchema, values: emptyDictForm },
  { name: 'dictItem', schema: dictItemFormSchema, values: emptyDictItemForm },
  { name: 'permission', schema: permissionFormSchema, values: emptyPermissionForm },
  { name: 'menu', schema: menuFormSchema, values: emptyMenuForm }
];

describe('manage 表单 schema', () => {
  it('每个表单都有对应的空表默认值', () => {
    expect(FORM_CASES).toHaveLength(8);
  });

  it.each(FORM_CASES)('$name 的默认值键集合与 schema 一致', ({ schema, values }) => {
    expect(schemaKeys(schema)).toEqual(Object.keys(values).sort());
  });

  it('空表默认值只包含 schema 允许的键（无多余键漂移）', () => {
    for (const { name, schema, values } of FORM_CASES) {
      const keys = schemaKeys(schema);

      expect(
        Object.keys(values).every(key => keys.includes(key)),
        `${name} 出现 schema 之外的键`
      ).toBe(true);
    }
  });

  it('枚举字段直接复用 shared schema（值域不会两份漂移）', () => {
    expect(schemaEntry(apiFormSchema, 'method')).toBe(apiMethodSchema);
    expect(schemaEntry(userFormSchema, 'enabled')).toBe(enabledSchema);
    expect(schemaEntry(menuFormSchema, 'menuType')).toBe(menuTypeSchema);
  });

  it('MANAGE_FORM_SCHEMAS 与各域导出同名', () => {
    expect(MANAGE_FORM_SCHEMAS.user).toBe(userFormSchema);
    expect(MANAGE_FORM_SCHEMAS.role).toBe(roleFormSchema);
    expect(MANAGE_FORM_SCHEMAS.api).toBe(apiFormSchema);
    expect(MANAGE_FORM_SCHEMAS.org).toBe(orgFormSchema);
    expect(MANAGE_FORM_SCHEMAS.dict).toBe(dictFormSchema);
    expect(MANAGE_FORM_SCHEMAS.dictItem).toBe(dictItemFormSchema);
    expect(MANAGE_FORM_SCHEMAS.permission).toBe(permissionFormSchema);
    expect(MANAGE_FORM_SCHEMAS.menu).toBe(menuFormSchema);
  });

  it('表单 schema 覆盖各域 DTO 的业务字段', () => {
    // 用户的 enabled 只在 update DTO 里；菜单的 enabled 两个 DTO 都有
    expect(schemaKeys(userFormSchema)).toEqual(
      ['email', 'enabled', 'fullName', 'homePath', 'password', 'phone', 'roleIds', 'username'].sort()
    );

    expect(schemaKeys(menuFormSchema)).toEqual(
      [
        'parentId',
        'menuType',
        'name',
        'code',
        'requiresAuth',
        'enabled',
        'icon',
        'i18nKey',
        'order',
        'iframeUrl',
        'href',
        'keepAlive',
        'multiTab',
        'pinned',
        'routeName',
        'routePath',
        'routeLayout',
        'routeComponent',
        'routeRedirect',
        'routeQueries',
        'routeParams',
        'description'
      ].sort()
    );
  });

  it('校验器可实例化（空表在必填字段上确实报错）', () => {
    const result = v.safeParse(userFormSchema, { ...emptyUserForm, username: '' });

    expect(result.success).toBe(false);
  });
});
