<template>
  <n-config-provider
    class="h-full"
    :locale="zhCN"
    :date-locale="dateZhCN"
    :theme="dark"
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
import { computed, watch } from 'vue';
import {
  NConfigProvider,
  NElement,
  NLoadingBarProvider,
  NDialogProvider,
  NNotificationProvider,
  NMessageProvider,
  darkTheme,
  zhCN,
  dateZhCN
} from 'naive-ui';
import { useDark } from '@vueuse/core';
import { AppProviderContent } from '@/components';
import { useThemeStore } from '@/store';

const osDark = useDark();
const theme = useThemeStore();
const { handleDarkMode } = useThemeStore();

/** 系统暗黑模式 */
const dark = computed(() => (theme.darkMode ? darkTheme : undefined));

// 操作系统的暗黑模式
watch(
  osDark,
  newValue => {
    handleDarkMode(newValue);
  },
  {
    immediate: true
  }
);
</script>
<style></style>
