<template>
  <n-config-provider
    class="h-full"
    :locale="zhCN"
    :date-locale="dateZhCN"
    :theme="naiveTheme"
    :theme-overrides="theme.themeOverrids"
  >
    <n-element class="h-full">
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
    </n-element>
  </n-config-provider>
</template>

<script lang="ts" setup>
import {
  NConfigProvider,
  NElement,
  NLoadingBarProvider,
  NDialogProvider,
  NNotificationProvider,
  NMessageProvider,
  zhCN,
  dateZhCN
} from 'naive-ui';
import { AppProviderContent } from '@/components';
import { useThemeStore } from '@/store';
import { useDarkMode } from '@/composables';

const theme = useThemeStore();
const { naiveTheme } = useDarkMode();
</script>
<style></style>
