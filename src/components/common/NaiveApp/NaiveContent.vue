<template>
  <div></div>
</template>

<script lang="ts" setup>
import { useLoadingBar, useDialog, useMessage, useNotification } from 'naive-ui';

function registerNaiveTool() {
  window.$loadingBar = useLoadingBar();
  window.$dialog = useDialog();
  window.$message = useMessage();
  window.$notification = useNotification();
}

registerNaiveTool();
</script>
<style scoped></style>
