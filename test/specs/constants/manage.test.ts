import { describe, expect, it } from 'vitest';
import * as v from 'valibot';
import {
  MANAGE_API_METHODS,
  MANAGE_ENABLED_VALUES,
  MANAGE_MENU_TYPES,
  MANAGE_RESOURCE_TYPES,
  MANAGE_YES_OR_NO_VALUES,
  MENU_CHILD_TYPES,
  MENU_IGNORED_ROUTE_TYPES,
  MENU_ROUTE_TYPES
} from '@/constants/manage';
import { MENU_TYPES } from '@/db/schema/shared';
import { permissionCreateSchema } from '@/schema/permission';
import { resourceTypeSearchSchema } from '@/schema/search';
import { API_METHODS, ENABLED_VALUES, enabledSchema, menuTypeSchema } from '@/schema/shared';

/**
 * 常量层与 schema 层的**值域一致性**护栏（P3-03）。
 *
 * `src/constants/manage.ts` 刻意不 import drizzle / valibot（那会把两份运行时
 * 依赖拉进客户端产物），代价是值域有两份声明：Constants 里一份供客户端渲染，
 * `src/schema/**` 与 `src/db/schema/**` 里一份供校验与服务端。
 *
 * 两份声明一旦漂移，症状是「前端下拉里能选的值，提交时被 valibot 拒绝」——
 * typecheck 看不到（两边都是 `readonly string[]`），只有跑起来才发现。
 * 本文件把那句注释里的承诺变成断言。
 */

describe('constants/manage 与 schema 值域一致', () => {
  it('MANAGE_ENABLED_VALUES === ENABLED_VALUES', () => {
    expect([...MANAGE_ENABLED_VALUES]).toEqual([...ENABLED_VALUES]);
  });

  it('MANAGE_ENABLED_VALUES 的每个值都能过 enabledSchema', () => {
    for (const value of MANAGE_ENABLED_VALUES) {
      expect(v.safeParse(enabledSchema, value).success, `enabled 值 ${value} 应合法`).toBe(true);
    }
  });

  it('MANAGE_MENU_TYPES === MENU_TYPES（drizzle 侧）且能过 menuTypeSchema', () => {
    expect([...MANAGE_MENU_TYPES]).toEqual([...MENU_TYPES]);

    for (const value of MANAGE_MENU_TYPES) {
      expect(v.safeParse(menuTypeSchema, value).success, `menuType 值 ${value} 应合法`).toBe(true);
    }
  });

  it('MANAGE_API_METHODS === API_METHODS（drizzle 侧，仅大小写之外全等）', () => {
    expect([...MANAGE_API_METHODS]).toEqual([...API_METHODS]);
  });

  it('MANAGE_RESOURCE_TYPES 与 permission schema 的 picklist 一致', () => {
    // permission 的 picklist 内联在 schema 里，只能逐值验证「常量里的值 schema 都认」
    for (const value of MANAGE_RESOURCE_TYPES) {
      const result = v.safeParse(permissionCreateSchema, { resourceType: value });
      expect(result.success, `resourceType 值 ${value} 应被 permissionCreateSchema 接受`).toBe(true);
    }

    expect([...MANAGE_RESOURCE_TYPES]).toContain('other');
  });

  it('MANAGE_RESOURCE_TYPES 与搜索 schema 的选项一致（含 SEARCH_ANY_VALUE 空串）', () => {
    for (const value of MANAGE_RESOURCE_TYPES) {
      expect(v.safeParse(resourceTypeSearchSchema, value).success, `搜索值 ${value} 应合法`).toBe(true);
    }

    expect(v.safeParse(resourceTypeSearchSchema, '').success).toBe(true);
  });

  it('MANAGE_YES_OR_NO_VALUES 是 MANAGE_ENABLED_VALUES 的子集（值域收窄，不是新枚举）', () => {
    for (const value of MANAGE_YES_OR_NO_VALUES) {
      expect(MANAGE_ENABLED_VALUES).toContain(value);
    }
  });

  it('MENU_ROUTE_TYPES / MENU_IGNORED_ROUTE_TYPES 是 MENU_TYPES 的不相交子集', () => {
    for (const values of [MENU_ROUTE_TYPES, MENU_IGNORED_ROUTE_TYPES]) {
      for (const value of values) {
        expect(MANAGE_MENU_TYPES, `${value} 不在 MENU_TYPES 内`).toContain(value);
      }
    }

    const overlap = MENU_ROUTE_TYPES.filter(type => new Set<string>(MENU_IGNORED_ROUTE_TYPES).has(type));
    expect(overlap).toEqual([]);

    // `directory`（靠 children 聚合）与 `link`（靠 href 外链）两组都不属于：
    // 它们既不写路由字段，也不参与顶部菜单渲染
    const uncovered: readonly string[] = [...MENU_ROUTE_TYPES, ...MENU_IGNORED_ROUTE_TYPES];
    expect([...uncovered]).not.toContain('directory');
    expect([...uncovered]).not.toContain('link');
  });

  it('MENU_CHILD_TYPES 的键集 === MENU_TYPES（每个菜单类型都有子类型约束）', () => {
    expect(Object.keys(MENU_CHILD_TYPES).sort()).toEqual([...MANAGE_MENU_TYPES].sort());
  });

  it('MENU_CHILD_TYPES 的值域不越界：每个允许的子类型都是合法 MENU_TYPES', () => {
    for (const [parent, children] of Object.entries(MENU_CHILD_TYPES)) {
      for (const child of children) {
        expect(MANAGE_MENU_TYPES, `${parent} 允许的子类型 ${child} 不在 MENU_TYPES 内`).toContain(child);
      }
    }
  });

  it('MENU_CHILD_TYPES 只允许 directory 挂 directory（其余父级不得嵌套目录）', () => {
    for (const [parent, children] of Object.entries(MENU_CHILD_TYPES)) {
      if (parent === 'directory') continue;
      expect(children, `${parent} 不该允许 directory 子级`).not.toContain('directory');
    }
  });

  it('叶子类型（button / other）没有子类型', () => {
    expect([...MENU_CHILD_TYPES.button]).toEqual([]);
    expect([...MENU_CHILD_TYPES.other]).toEqual([]);
  });

  it('值域无重复项（picklist 重复值会让下拉出现两个同值项）', () => {
    for (const values of [
      MANAGE_ENABLED_VALUES,
      MANAGE_YES_OR_NO_VALUES,
      MANAGE_MENU_TYPES,
      MANAGE_API_METHODS,
      MANAGE_RESOURCE_TYPES
    ]) {
      expect(new Set(values).size, `值域 ${values.join('/')} 有重复项`).toBe(values.length);
    }
  });
});
