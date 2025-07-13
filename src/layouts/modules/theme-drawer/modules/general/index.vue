<script setup lang="ts">
import GlobalSettings from './modules/global-settings.vue';
import WatermarkSettings from './modules/watermark-settings.vue';

defineOptions({
  name: 'GeneralSettings'
});
</script>

<template>
  <div class="flex-col-stretch gap-16px">
    <GlobalSettings />
    <WatermarkSettings />
  </div>
</template>

<style scoped></style>
