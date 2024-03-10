<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import type { MentionOption, MenuProps } from 'naive-ui';
import { SimpleScrollbar } from '@sa/materials';
import type { RouteKey } from '@elegant-router/types';
import { useAppStore } from '@/store/modules/app';
import { useThemeStore } from '@/store/modules/theme';
import { useRouteStore } from '@/store/modules/route';
import { useRouterPush } from '@/hooks/common/router';

defineOptions({
  name: 'BaseMenu'
});

interface Props {
  darkTheme?: boolean;
  mode?: MenuProps['mode'];
  menus: App.Global.Menu[];
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'vertical'
});

const route = useRoute();
const appStore = useAppStore();
const themeStore = useThemeStore();
const routeStore = useRouteStore();
const { routerPushByKey } = useRouterPush();

const naiveMenus = computed(() => props.menus as unknown as MentionOption[]);

const isHorizontal = computed(() => props.mode === 'horizontal');

const siderCollapse = computed(() => themeStore.layout.mode === 'vertical' && appStore.siderCollapse);

const headerHeight = computed(() => `${themeStore.header.height}px`);

const selectedKey = computed(() => {
  const { hideInMenu, activeMenu } = route.meta;
  const name = route.name as string;

  const routeName = (hideInMenu ? activeMenu : name) || name;

  return routeName;
});

const expandedKeys = ref<string[]>([]);

function updateExpandedKeys() {
  if (isHorizontal.value || siderCollapse.value || !selectedKey.value) {
    expandedKeys.value = [];
    return;
  }
  expandedKeys.value = routeStore.getSelectedMenuKeyPath(selectedKey.value);
}

function handleClickMenu(key: RouteKey) {
  const { query } = routeStore.getSelectedMenuMetaByKey(key) || {};

  routerPushByKey(key, { query });
}

watch(
  () => route.name,
  () => {
    updateExpandedKeys();
  },
  { immediate: true }
);
</script>

<template>
  <SimpleScrollbar>
    <NMenu
      v-model:expanded-keys="expandedKeys"
      :mode="mode"
      :value="selectedKey"
      :collapsed="siderCollapse"
      :collapsed-width="themeStore.sider.collapsedWidth"
      :collapsed-icon-size="22"
      :options="naiveMenus"
      :inverted="darkTheme"
      :indent="18"
      responsive
      @update:value="handleClickMenu"
    />
  </SimpleScrollbar>
</template>

<style scoped>
:deep(.n-menu--horizontal) {
  --n-item-height: v-bind(headerHeight) !important;
}
</style>
