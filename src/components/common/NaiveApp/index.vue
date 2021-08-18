<template>
  <n-loading-bar-provider>
    <n-dialog-provider>
      <n-notification-provider>
        <n-message-provider>
          <slot></slot>
          <naive-content />
        </n-message-provider>
      </n-notification-provider>
    </n-dialog-provider>
  </n-loading-bar-provider>
</template>

<script lang="ts" setup>
import { NLoadingBarProvider, NDialogProvider, NNotificationProvider, NMessageProvider } from 'naive-ui';
import NaiveContent from './NaiveContent.vue';
</script>
<style scoped></style>
