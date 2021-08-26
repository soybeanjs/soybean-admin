<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN" :theme="theme" :theme-overrides="app.themeOverrids">
    <n-loading-bar-provider>
      <n-dialog-provider>
        <n-notification-provider>
          <n-message-provider>
            <slot></slot>
            <app-provider-content />
          </n-message-provider>
        </n-notification-provider>
      </n-dialog-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import {
  NConfigProvider,
  darkTheme,
  zhCN,
  dateZhCN,
  NLoadingBarProvider,
  NDialogProvider,
  NNotificationProvider,
  NMessageProvider
} from 'naive-ui';
import { AppProviderContent } from '@/components';
import { useAppStore } from '@/store';

const app = useAppStore();
const theme = computed(() => (app.themeSettings.darkMode ? darkTheme : undefined));
</script>
<style scoped></style>
