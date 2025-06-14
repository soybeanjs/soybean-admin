<script setup lang="ts">
import LayoutMode from './modules/layout-mode.vue';
import TabSettings from './modules/tab-settings.vue';
import HeaderSettings from './modules/header-settings.vue';
import SiderSettings from './modules/sider-settings.vue';
import FooterSettings from './modules/footer-settings.vue';
import ContentSettings from './modules/content-settings.vue';

defineOptions({
  name: 'LayoutSettings'
});
</script>

<template>
  <div class="flex-col-stretch gap-16px">
    <LayoutMode />
    <TabSettings />
    <HeaderSettings />
    <SiderSettings />
    <FooterSettings />
    <ContentSettings />
  </div>
</template>

<style scoped></style>
