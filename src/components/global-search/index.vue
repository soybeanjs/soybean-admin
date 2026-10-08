<script setup lang="ts">
import { computed } from 'vue';
import { onKeyStroke } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import { SCommand, SDialog, SKbd, useTheme } from '@vean/ui';
import type { SelectEvent } from '@vean/ui';
import { useAppStore, useMenuStore } from '@/store';
import { getRouter } from '@/router/instance';
import { SEARCH_GROUP_ACTION, flattenMenuEntries, groupEntries } from './shared';
import type { SearchEntry } from './shared';

/**
 * 全局搜索（P2-11）。
 *
 * 数据源是菜单树（不是路由表）：菜单才是用户可见的可跳转集合，权限过滤已在
 * `menuStore.initMenu` 做过。`SCommand` 自带 Fuse 模糊匹配 + roving focus 键盘导航
 * （↑↓ / Enter / Esc），所以这里只做「树 → 条目」和「选中 → 动作」。
 *
 * Ctrl/Cmd+K 唤起；条目 `value` 是路由名，跳转用 `path` —— 与 layout 的菜单选中
 * 同一理由：dynamic 模式运行时注册的路由名不在 `RouteNamedMap` 字面量并集里，
 * `push({ name })` 过不了类型。
 */
defineOptions({ name: 'GlobalSearch' });

const { t } = useI18n();

const appStore = useAppStore();
const menuStore = useMenuStore();
const theme = useTheme('GlobalSearch');

/** 动作条目的 value（非路由名，选中时分派） */
const ACTION_THEME_DRAWER = 'action:theme-drawer';
const ACTION_TOGGLE_MODE = 'action:toggle-mode';

/** 菜单条目 + 动作条目（动作在后，与 v2 的搜索面板一致） */
const commandEntries = computed<SearchEntry[]>(() => {
  const menuEntries = flattenMenuEntries(menuStore.items);
  const actions: SearchEntry[] = [
    {
      value: ACTION_THEME_DRAWER,
      label: t('search.action.themeDrawer'),
      icon: 'lucide:palette',
      group: SEARCH_GROUP_ACTION
    },
    {
      value: ACTION_TOGGLE_MODE,
      label: t('search.action.toggleMode'),
      icon: 'lucide:sun-moon',
      group: SEARCH_GROUP_ACTION
    }
  ];

  return [...menuEntries, ...actions];
});

/** 条目 value → path，选中时查表（`SCommand` 的 select 事件只回 value） */
const entryPathMap = computed(() => {
  const map = new Map<string, string>();

  for (const entry of commandEntries.value) {
    if (entry.path) map.set(entry.value, entry.path);
  }

  return map;
});

/**
 * `SCommand` 的 items：分组打包 + 菜单文案解析。
 *
 * store 里存的是 i18n key（标题单一来源），菜单条目按 `t(i18nKey) || label` 解析
 * —— 与 layout 的菜单项同一语义（分组文案是常量表里的 `label` 字段，不走这里）。
 */
const commandItems = computed(() =>
  groupEntries(commandEntries.value).map(group => ({
    ...group,
    items: group.items.map(item => ({ ...item, label: item.i18nKey ? t(item.i18nKey) : item.label }))
  }))
);

const open = computed({
  get: () => appStore.searchVisible,
  set: (value: boolean) => appStore.setSearchVisible(value)
});

function onSelect(event: SelectEvent<string>): void {
  const value = event.detail.value;

  if (value) {
    const path = entryPathMap.value.get(value);

    if (path) {
      void getRouter().push(path);
    } else if (value === ACTION_THEME_DRAWER) {
      appStore.setThemeDrawerVisible(true);
    } else if (value === ACTION_TOGGLE_MODE) {
      theme.setMode(theme.effectiveMode.value === 'dark' ? 'light' : 'dark');
    }
  }

  appStore.setSearchVisible(false);
}

/** Ctrl/Cmd+K 全局唤起（`k`/`K` 都监听：CapsLock / Shift 下 `key` 会变，修饰键在此判） */
function onKeydown(event: KeyboardEvent): void {
  if (!(event.ctrlKey || event.metaKey) || event.repeat) return;

  event.preventDefault();
  appStore.toggleSearch();
}

onKeyStroke(['k', 'K'], onKeydown);
</script>

<template>
  <SDialog v-model:open="open" :pure="true" :show-close="false" class="w-full max-w-xl">
    <SCommand
      :items="commandItems"
      :placeholder="t('search.placeholder')"
      :empty-label="t('search.empty')"
      :fuse-options="{ resultLimit: 20 }"
      clearable
      @select="onSelect"
    >
      <template #bottom>
        <div class="flex items-center gap-4 px-1 pt-2 text-xs text-muted-foreground">
          <span class="flex items-center gap-1">
            <SKbd :value="['↑', '↓']" />
            {{ t('search.hint.navigate') }}
          </span>
          <span class="flex items-center gap-1">
            <SKbd value="Enter" />
            {{ t('search.hint.select') }}
          </span>
          <span class="flex items-center gap-1">
            <SKbd value="Esc" />
            {{ t('search.hint.close') }}
          </span>
        </div>
      </template>
    </SCommand>
  </SDialog>
</template>
