<template>
  <div>
    <n-space>
      <n-button v-for="item in actions" :key="item.key" type="primary" @click="handleClick(item.key)">
        {{ item.label }}
      </n-button>
    </n-space>
    <n-space>
      <n-button>Default</n-button>
      <n-button type="primary">Primary</n-button>
      <n-button type="info">Info</n-button>
      <n-button type="success">Success</n-button>
      <n-button type="warning">Warning</n-button>
      <n-button type="error">Error</n-button>
    </n-space>
    <router-link to="/system">system</router-link>
  </div>
</template>

<script lang="ts" setup>
import { useDialog, useNotification, useMessage } from 'naive-ui';

type ActionType = 'dialog' | 'notification' | 'message';
interface Action {
  key: ActionType;
  label: string;
}

defineProps({
  code: {
    type: String,
    default: ''
  }
});

const dialog = useDialog();
const notification = useNotification();
const message = useMessage();

const actions: Action[] = [
  { key: 'dialog', label: 'dialog' },
  { key: 'notification', label: 'notification' },
  { key: 'message', label: 'message' }
];
function handleClick(type: ActionType) {
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
