<template>
  <div class="flex items-end h-full">
    <browser-tab-item
      v-for="(item, index) in app.multiTab.routes"
      :key="item.path"
      v-model:hover-index="hoverIndex"
      :current-index="index"
      :active-index="app.activeMultiTabIndex"
      :closable="item.name !== ROUTE_HOME.name"
      @click="handleClickTab(item.fullPath)"
      @close="removeMultiTab(item.fullPath)"
    >
      {{ item.meta?.title }}
    </browser-tab-item>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAppStore } from '@/store';
import { ROUTE_HOME } from '@/router';
import { BrowserTabItem } from './components';

const app = useAppStore();
const { removeMultiTab, handleClickTab } = useAppStore();

const hoverIndex = ref(NaN);
</script>
<style scoped></style>
