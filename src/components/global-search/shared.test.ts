import { describe, expect, it } from 'vitest';
import type { MenuTreeNode } from '@/typings/app';
import { SEARCH_GROUP_ACTION, SEARCH_GROUP_MENU, flattenMenuEntries, groupEntries } from './shared';

/**
 * P2-11：全局搜索的数据整形守卫。
 *
 * 菜单树是唯一数据源：目录节点（无 `path`）必须被排除、父子顺序必须稳定
 * （分组顺序 = 首次出现顺序），否则搜索结果会出现「点进去 404 的目录项」。
 */

const MENU: MenuTreeNode[] = [
  { value: 'dashboard', label: '仪表盘', i18nKey: 'route.dashboard', icon: 'lucide:home', path: '/dashboard' },
  {
    value: 'system',
    label: '系统管理',
    icon: 'lucide:settings',
    children: [
      { value: 'system-user', label: '用户管理', i18nKey: 'route.user', path: '/system/user' },
      { value: 'system-role', label: '角色管理', path: '/system/role' }
    ]
  },
  { value: 'external', label: '外链', path: 'https://example.com' }
];

describe('菜单树展平', () => {
  it('只把带 path 的节点变成搜索项（目录节点不可点击）', () => {
    const values = flattenMenuEntries(MENU).map(entry => entry.value);

    expect(values).toEqual(['dashboard', 'system-user', 'system-role', 'external']);
    expect(values).not.toContain('system');
  });

  it('父节点排在子节点前，且保留 path / icon', () => {
    const entries = flattenMenuEntries(MENU);

    expect(entries[0]).toMatchObject({ value: 'dashboard', path: '/dashboard', icon: 'lucide:home' });
    expect(entries[1]).toMatchObject({ value: 'system-user', path: '/system/user' });
  });

  it('有 i18nKey 的带出 key（延迟翻译），没有的带 label 原文', () => {
    const entries = flattenMenuEntries(MENU);

    expect(entries[0]?.i18nKey).toBe('route.dashboard');
    expect(entries[0]?.label).toBe('仪表盘');
    expect(entries[2]?.i18nKey).toBeUndefined();
    expect(entries[2]?.label).toBe('角色管理');
  });

  it('默认归入菜单组；传自定义组时整棵子树都归该组', () => {
    expect(new Set(flattenMenuEntries(MENU).map(entry => entry.group))).toEqual(new Set([SEARCH_GROUP_MENU]));
    expect(new Set(flattenMenuEntries(MENU, SEARCH_GROUP_ACTION).map(entry => entry.group))).toEqual(
      new Set([SEARCH_GROUP_ACTION])
    );
  });

  it('空树展平为空数组（不抛错）', () => {
    expect(flattenMenuEntries([])).toEqual([]);
  });
});

describe('搜索结果分组', () => {
  it('分组顺序 = 首次出现顺序，组值带 group- 前缀避免与路由名撞车', () => {
    const groups = groupEntries([
      { value: 'a', label: 'A', group: SEARCH_GROUP_MENU },
      { value: 'b', label: 'B', group: SEARCH_GROUP_ACTION },
      { value: 'c', label: 'C', group: SEARCH_GROUP_MENU }
    ]);

    expect(groups.map(group => group.value)).toEqual([
      `group-${SEARCH_GROUP_MENU.value}`,
      `group-${SEARCH_GROUP_ACTION.value}`
    ]);
    expect(groups[0]?.items.map(entry => entry.value)).toEqual(['a', 'c']);
    expect(groups[1]?.items.map(entry => entry.value)).toEqual(['b']);
  });

  it('组标签来自分组常量（常量表里的 i18n key，交给 remove:i18n 内联）', () => {
    const groups = groupEntries([{ value: 'x', label: 'X', group: SEARCH_GROUP_ACTION }]);

    expect(groups).toHaveLength(1);
    expect(groups[0]?.label).toBe(SEARCH_GROUP_ACTION.label);
  });

  it('无结果时返回空分组列表', () => {
    expect(groupEntries([])).toEqual([]);
  });
});
