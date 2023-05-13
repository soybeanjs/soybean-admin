<template>
  <n-config-provider
    :theme="theme.naiveTheme"
    :theme-overrides="theme.naiveThemeOverrides"
    :locale="zhCN"
    :date-locale="dateZhCN"
    class="h-full"
  >
    <naive-provider>
      <router-view />
    </naive-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import { dateZhCN, zhCN } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { subscribeStore, useThemeStore } from '@/store';
import { useGlobalEvents } from '@/composables';

const theme = useThemeStore();
const { locale, t } = useI18n();
const route = useRoute();

subscribeStore();
useGlobalEvents();

watch(
  () => locale.value,
  () => {
    document.title = route.meta.i18nTitle ? t(route.meta.i18nTitle) : route.meta.title;
  }
);
</script>

<style scoped></style>
