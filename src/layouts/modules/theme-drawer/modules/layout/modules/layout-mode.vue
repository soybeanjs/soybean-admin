<script setup lang="ts">
import { useAppStore } from '@/store/modules/app';
import { useThemeStore } from '@/store/modules/theme';
import { $t } from '@/locales';
import LayoutModeCard from '../../../components/layout-mode-card.vue';

defineOptions({
  name: 'LayoutMode'
});

const appStore = useAppStore();
const themeStore = useThemeStore();
</script>

<template>
  <NDivider>{{ $t('theme.layout.layoutMode.title') }}</NDivider>
  <LayoutModeCard v-model:mode="themeStore.layout.mode" :disabled="appStore.isMobile">
    <template #vertical>
      <div class="layout-sider h-full w-18px !bg-primary"></div>
      <div class="vertical-wrapper">
        <div class="layout-header bg-primary-200"></div>
        <div class="layout-main"></div>
      </div>
    </template>
    <template #vertical-mix>
      <div class="layout-sider h-full w-8px !bg-primary"></div>
      <div class="layout-sider h-full w-16px !bg-primary-300"></div>
      <div class="vertical-wrapper">
        <div class="layout-header bg-primary-200"></div>
        <div class="layout-main"></div>
      </div>
    </template>
    <template #vertical-hybrid-header-first>
      <div class="layout-sider h-full w-8px !bg-primary"></div>
      <div class="layout-sider h-full w-16px !bg-primary-300"></div>
      <div class="vertical-wrapper">
        <div class="layout-header bg-primary"></div>
        <div class="layout-main"></div>
      </div>
    </template>
    <template #horizontal>
      <div class="layout-header !bg-primary"></div>
      <div class="horizontal-wrapper">
        <div class="layout-main"></div>
      </div>
    </template>
    <template #top-hybrid-sidebar-first>
      <div class="layout-header !bg-primary-300"></div>
      <div class="horizontal-wrapper">
        <div class="layout-sider w-18px !bg-primary"></div>
        <div class="layout-main"></div>
      </div>
    </template>
    <template #top-hybrid-header-first>
      <div class="layout-header bg-primary"></div>
      <div class="horizontal-wrapper">
        <div class="layout-sider w-18px"></div>
        <div class="layout-main"></div>
      </div>
    </template>
  </LayoutModeCard>
</template>

<style scoped>
.layout-header {
  --uno: h-16px rd-4px;
}

.layout-sider {
  --uno: bg-primary-300 rd-4px;
}

.layout-main {
  --uno: flex-1 bg-primary-200 rd-4px;
}

.vertical-wrapper {
  --uno: flex-1 flex-col gap-6px;
}

.horizontal-wrapper {
  --uno: flex-1 flex gap-6px;
}
</style>
