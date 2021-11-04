<template>
  <n-space :vertical="true" :size="16">
    <header-info />
  </n-space>
</template>
<script lang="ts" setup>
import { onActivated } from 'vue';
import { NSpace } from 'naive-ui';
import { useLoading } from '@/hooks';
import { HeaderInfo } from './components';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { loading, startLoading, endLoading } = useLoading(true);

function handleEndLoading() {
  startLoading();
  setTimeout(() => {
    endLoading();
  }, 800);
}
onActivated(() => {
  handleEndLoading();
});
</script>
<style scoped></style>
