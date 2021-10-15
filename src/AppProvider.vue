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
import { addColorAlpha } from '@/utils';

const theme = useThemeStore();
const dark = computed(() => (theme.darkMode ? darkTheme : undefined));

const primary = computed(() => theme.themeColor);
const primaryWithAlpha = computed(() => {
  const alpha = theme.darkMode ? 0.15 : 0.1;
  return addColorAlpha(primary.value, alpha);
});
</script>
<style>
/* 全局与主题颜色相关 */
.g_text-primary {
  color: v-bind(primary);
}
.g_bg-primary {
  background-color: v-bind(primary);
}
.g_bg-primary_active {
  background-color: v-bind(primaryWithAlpha);
}
.g_border-primary {
  border-color: v-bind(primary);
}
</style>
