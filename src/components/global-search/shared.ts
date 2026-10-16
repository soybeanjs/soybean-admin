/** 全局搜索（P2-11）的纯逻辑部分 详见 docs/v3-notes.md N-033。 */

import type { MenuTreeNode } from '@/typings/app';

/** 搜索分组（`label` 是 i18n key，`value` 用作稳定分组 id） */
export interface SearchGroupKey {
  value: string;
  label: string;
}

/** 条目分组：菜单之外还有动作（开主题抽屉等） */
export const SEARCH_GROUP_MENU: SearchGroupKey = { value: 'menu', label: 'search.group.menu' };
export const SEARCH_GROUP_ACTION: SearchGroupKey = { value: 'action', label: 'search.group.action' };

/** `SCommand` 的条目形态（`CommandSingleOptionData` 的必要子集，`value` 即路由名） */
export interface SearchEntry {
  value: string;
  /** i18n key；缺失时展示 `label`（与 layout 菜单项同语义） */
  i18nKey?: string;
  label: string;
  icon?: string;
  group: SearchGroupKey;
  /** 可导航路径；目录节点没有，所以不会成为条目 */
  path?: string;
}

/** `SCommand` 的分组形态 */
export interface SearchGroup {
  value: string;
  label: string;
  items: SearchEntry[];
}

/** 展平菜单树 详见 docs/v3-notes.md N-034。 */
export function flattenMenuEntries(
  items: readonly MenuTreeNode[],
  group: SearchGroupKey = SEARCH_GROUP_MENU
): SearchEntry[] {
  return items.flatMap(item => {
    const self: SearchEntry[] = item.path
      ? [{ value: item.value, label: item.label, i18nKey: item.i18nKey, icon: item.icon, group, path: item.path }]
      : [];
    const children = item.children?.length ? flattenMenuEntries(item.children, group) : [];

    return [...self, ...children];
  });
}

/** 按分组打包成 `SCommand` 的 `items`。分组 `value` 加 `group-` 前缀，避免与作为条目 `value` 的路由名撞车；分组顺序按首次出现（菜单在前，动作在后）。 */
export function groupEntries(entries: readonly SearchEntry[]): SearchGroup[] {
  const keys = entries
    .map(entry => entry.group)
    .filter((group, index, all) => all.findIndex(item => item.value === group.value) === index);

  return keys.map(group => ({
    value: `group-${group.value}`,
    label: group.label,
    items: entries.filter(entry => entry.group.value === group.value)
  }));
}
