<template>
  <div>
    <n-spin :show="loading">
      <n-space :vertical="true">
        <div>
          <n-gradient-text type="primary" size="32">GradientText</n-gradient-text>
          <n-space>
            <n-gradient-text>Default</n-gradient-text>
            <n-gradient-text type="primary">Primary</n-gradient-text>
            <n-gradient-text type="info">Info</n-gradient-text>
            <n-gradient-text type="success">Success</n-gradient-text>
            <n-gradient-text type="warning">Warning</n-gradient-text>
            <n-gradient-text type="error">Error</n-gradient-text>
          </n-space>
        </div>
        <div>
          <n-gradient-text type="primary" size="32">Button</n-gradient-text>
          <n-space>
            <n-button>Default</n-button>
            <n-button type="primary">Primary</n-button>
            <n-button type="info">Info</n-button>
            <n-button type="success">Success</n-button>
            <n-button type="warning">Warning</n-button>
            <n-button type="error">Error</n-button>
          </n-space>
        </div>
        <n-gradient-text type="primary" size="32">Tag</n-gradient-text>
        <n-space>
          <n-tag>Tag</n-tag>
          <n-tag type="primary">Primary</n-tag>
          <n-tag type="info">Info</n-tag>
          <n-tag type="success">Success</n-tag>
          <n-tag type="warning">Warning</n-tag>
          <n-tag type="error">Error</n-tag>
        </n-space>
        <div>
          <n-gradient-text type="primary" size="32">Switch | Checkbox | Radio</n-gradient-text>
          <n-space>
            <n-switch :default-value="true" />
            <n-checkbox :default-checked="true" />
            <n-radio :default-checked="true" />
          </n-space>
        </div>
        <n-space>
          <n-button type="primary" @click="handleDialog">Dialog</n-button>
        </n-space>
      </n-space>
    </n-spin>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { NGradientText, NSpace, NButton, NSpin, NTag, NSwitch, NCheckbox, NRadio, useDialog } from 'naive-ui';

const dialog = useDialog();

const loading = ref(true);

setTimeout(() => {
  loading.value = false;
}, 1500);

function handleDialog() {
  dialog.info({
    title: '提示',
    content: '您确定要退出登录吗？',
    positiveText: '确定',
    negativeText: '取消'
  });
}
</script>
<style scoped></style>
