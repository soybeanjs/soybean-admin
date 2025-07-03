<script setup lang="ts">
import { useThemeStore } from '@/store/modules/theme';
import LayoutMode from './modules/layout-mode.vue';
import TabSettings from './modules/tab-settings.vue';
import HeaderSettings from './modules/header-settings.vue';
import SiderSettings from './modules/sider-settings.vue';
import FooterSettings from './modules/footer-settings.vue';
import ContentSettings from './modules/content-settings.vue';

defineOptions({
  name: 'LayoutSettings'
});

const themeStore = useThemeStore();
</script>

<template>
  <div class="flex-col-stretch gap-16px">
    <LayoutMode />
    <TabSettings />
    <HeaderSettings />
    <!-- The top menu mode does not have a sidebar -->
    <SiderSettings v-if="themeStore.layout.mode !== 'horizontal'" />
    <FooterSettings />
    <ContentSettings />
  </div>
</template>

<style scoped></style>
