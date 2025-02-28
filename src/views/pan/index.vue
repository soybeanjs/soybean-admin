<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore } from '@/store/modules/app';
import FileAside from './modules/file-aside.vue';
import FileMain from './modules/file-main.vue';

const appStore = useAppStore();

const gap = computed(() => (appStore.isMobile ? 0 : 16));
</script>

<template>
  <div class="h-full flex-col">
    <div class="h-full flex pb[-28px]">
      <NGrid :x-gap="gap" responsive="screen" item-responsive>
        <NGridItem span="0 s:8 m:6 l:5 xl:4">
          <FileAside></FileAside>
        </NGridItem>
        <NGridItem span="24 s:16 m:18 l:19 xl:20">
          <FileMain />
        </NGridItem>
      </NGrid>
    </div>
  </div>
</template>

<style scoped></style>
