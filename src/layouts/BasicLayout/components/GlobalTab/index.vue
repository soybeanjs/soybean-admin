<template>
  <div v-if="fixedHeaderAndTab && theme.navStyle.mode !== 'horizontal-mix'" class="multi-tab-height w-full"></div>
  <div
    class="multi-tab-height flex-y-center justify-between w-full px-10px"
    :class="{ 'multi-tab-top absolute': fixedHeaderAndTab, 'bg-[#f5f7f9]': !theme.darkMode }"
    :style="{ zIndex }"
  >
    <n-space :align="'center'">
      <n-tag
        v-for="item in app.multiTab.routes"
        :key="item.path"
        :type="app.multiTab.activeRoute === item.fullPath ? 'primary' : 'default'"
        class="cursor-pointer"
        :closable="item.name !== ROUTE_HOME.name"
        size="large"
        @click="handleClickTab(item.fullPath)"
        @close.stop="removeMultiTab(item.fullPath)"
      >
        {{ item.meta?.title }}
      </n-tag>
    </n-space>
    <h3>{{ reload }}</h3>
    <div class="flex-center w-32px h-32px bg-white cursor-pointer" @click="handleReload">
      <icon-mdi-refresh class="text-16px" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { NSpace, NTag } from 'naive-ui';
import { useThemeStore, useAppStore } from '@/store';
// import { useRouterChange } from '@/hooks';
import { useReloadInject } from '@/context';
import { ROUTE_HOME } from '@/router';

defineProps({
  zIndex: {
    type: Number,
    default: 0
  }
});

const route = useRoute();
const theme = useThemeStore();
const app = useAppStore();
const { initMultiTab, addMultiTab, removeMultiTab, setActiveMultiTab, handleClickTab } = useAppStore();
// const { toReload } = useRouterChange();
const { reload, handleReload } = useReloadInject();

const fixedHeaderAndTab = computed(() => theme.fixedHeaderAndTab || theme.navStyle.mode === 'horizontal-mix');
const multiTabHeight = computed(() => {
  const { height } = theme.multiTabStyle;
  return `${height}px`;
});
const headerHeight = computed(() => {
  const { height } = theme.headerStyle;
  return `${height}px`;
});

// async function handleReload() {
//   // toReload(route.fullPath);
// }

function init() {
  initMultiTab();
}

watch(
  () => route.fullPath,
  newValue => {
    addMultiTab(route);
    setActiveMultiTab(newValue);
  }
);

// 初始化
init();
</script>
<style scoped>
.multi-tab-height {
  height: v-bind(multiTabHeight);
}
.multi-tab-top {
  top: v-bind(headerHeight);
}
</style>
