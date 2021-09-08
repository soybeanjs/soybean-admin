<template>
  <n-config-provider
    class="h-full"
    :locale="zhCN"
    :date-locale="dateZhCN"
    :theme="dark"
    :theme-overrides="theme.themeOverrids"
  >
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
import { useThemeStore } from '@/store';

const theme = useThemeStore();
const dark = computed(() => (theme.darkMode ? darkTheme : undefined));
</script>
<style scoped></style>
