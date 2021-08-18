<template>
  <div>
    <n-space>
      <n-button v-for="item in actions" :key="item.key" type="primary" @click="handleClick(item.key)">
        {{ item.label }}
      </n-button>
    </n-space>
  </div>
</template>

<script lang="ts" setup>
import { useLoadingBar, useDialog, useNotification, useMessage } from 'naive-ui';

type ActionType = 'loading-bar' | 'dialog' | 'notification' | 'message';
interface Action {
  key: ActionType;
  label: string;
}

const loadingBar = useLoadingBar();
const dialog = useDialog();
const notification = useNotification();
const message = useMessage();

const actions: Action[] = [
  { key: 'loading-bar', label: 'loading bar' },
  { key: 'dialog', label: 'dialog' },
  { key: 'notification', label: 'notification' },
  { key: 'message', label: 'message' }
];
function handleClick(type: ActionType) {
  if (type === 'loading-bar') {
    loadingBar.start();
    setTimeout(() => {
      loadingBar.finish();
    }, 5000);
  }
  if (type === 'dialog') {
    dialog.info({ content: '弹窗示例！' });
  }
  if (type === 'notification') {
    notification.info({ content: '通知示例！' });
  }
  if (type === 'message') {
    message.info('消息示例！');
  }
}
</script>
<style scoped></style>
