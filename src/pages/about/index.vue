<script setup lang="ts">
import AboutPage from '@/views/about/index.vue';

definePage({
  meta: {
    title: '关于',
    i18nKey: 'route.about',
    icon: 'mdi:information-outline',
    order: 900
  }
});
</script>

<template>
  <AboutPage />
</template>
