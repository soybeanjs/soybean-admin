<template>
  <n-divider title-placement="center">布局模式</n-divider>
  <n-space justify="space-around" :wrap="true" :size="24" class="px-12px">
    <layout-card
      v-for="item in theme.layout.modeList"
      :key="item.value"
      :mode="item.value"
      :label="item.label"
      :checked="item.value === theme.layout.mode"
      @click="theme.setLayoutMode(item.value)"
    >
      <template v-if="item.value === 'vertical'">
        <div class="w-18px h-full bg-primary:50 rd-4px"></div>
        <div class="flex-1 flex-col gap-6px">
          <div class="h-16px bg-primary rd-4px"></div>
          <div class="flex-1 bg-primary:25 rd-4px"></div>
        </div>
      </template>
      <template v-if="item.value === 'vertical-mix'">
        <div class="w-8px h-full bg-primary:50 rd-4px"></div>
        <div class="w-16px h-full bg-primary:50 rd-4px"></div>
        <div class="flex-1 flex-col gap-6px">
          <div class="h-16px bg-primary rd-4px"></div>
          <div class="flex-1 bg-primary:25 rd-4px"></div>
        </div>
      </template>
      <template v-if="item.value === 'horizontal'">
        <div class="h-16px bg-primary rd-4px"></div>
        <div class="flex-1 flex gap-6px">
          <div class="flex-1 bg-primary:25 rd-4px"></div>
        </div>
      </template>
      <template v-if="item.value === 'horizontal-mix'">
        <div class="h-16px bg-primary rd-4px"></div>
        <div class="flex-1 flex gap-6px">
          <div class="w-18px bg-primary:50 rd-4px"></div>
          <div class="flex-1 bg-primary:25 rd-4px"></div>
        </div>
      </template>
    </layout-card>
  </n-space>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/store';
import { LayoutCard } from './components';

defineOptions({ name: 'LayoutMode' });

const theme = useThemeStore();
</script>

<style scoped>
.layout-card__shadow {
  box-shadow: 0 1px 2.5px rgba(0, 0, 0, 0.18);
}
</style>
