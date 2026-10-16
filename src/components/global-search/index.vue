<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { onKeyStroke } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import { SCommand, SDialog, SKbd, useTheme } from '@vean/ui';
import type { SelectEvent } from '@vean/ui';
import { normalizeRoutePath } from '@/shared/route';
import { useAppStore, useMenuStore } from '@/store';
import { SEARCH_GROUP_ACTION, flattenMenuEntries, groupEntries } from './shared';
import type { SearchEntry } from './shared';

/** 全局搜索（P2-11） 详见 docs/v3-notes.md N-031。 */
defineOptions({ name: 'GlobalSearch' });

const { t } = useI18n();

const appStore = useAppStore();
const menuStore = useMenuStore();
const router = useRouter();
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

/** `SCommand` 的 items：分组打包 + 菜单文案解析 详见 docs/v3-notes.md N-032。 */
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
      void router.push(normalizeRoutePath(path));
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
