<template>
  <div></div>
</template>

<script lang="ts" setup>
import { useLoadingBar, useDialog, useMessage, useNotification } from 'naive-ui';

// 挂载naive组件的方法至window, 以便在路由钩子函数和请求函数里面调用
function registerNaiveTools() {
  window.$loadingBar = useLoadingBar();
  window.$dialog = useDialog();
  window.$message = useMessage();
  window.$notification = useNotification();
}

registerNaiveTools();
</script>
<style scoped></style>
