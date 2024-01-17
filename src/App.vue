<script setup lang="ts">
import { computed } from 'vue';
import { NConfigProvider, darkTheme } from 'naive-ui';
import { useAppStore } from './store/modules/app';
import { useThemeStore } from './store/modules/theme';
import { naiveDateLocales, naiveLocales } from './locales/naive';
import AppLoading from './components/common/app-loading.vue';

defineOptions({
  name: 'App'
});

const appStore = useAppStore();
const themeStore = useThemeStore();

const naiveDarkTheme = computed(() => (themeStore.darkMode ? darkTheme : undefined));

const naiveLocale = computed(() => {
  return naiveLocales[appStore.locale];
});

const naiveDateLocale = computed(() => {
  return naiveDateLocales[appStore.locale];
});
</script>

<template>
  <Suspense>
    <NConfigProvider
      :theme="naiveDarkTheme"
      :theme-overrides="themeStore.naiveTheme"
      :locale="naiveLocale"
      :date-locale="naiveDateLocale"
      class="h-full"
    >
      <AppProvider>
        <RouterView class="bg-layout" />
      </AppProvider>
    </NConfigProvider>
    <template #fallback>
      <AppLoading />
    </template>
  </Suspense>
</template>

<style scoped></style>
