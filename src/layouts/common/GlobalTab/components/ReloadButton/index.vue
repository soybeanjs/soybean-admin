<template>
  <hover-container class="w-64px h-full" tooltip-content="重新加载" placement="bottom-end" @click="handleRefresh">
    <icon-mdi-refresh class="text-18px" :class="{ 'reload-animation': loading }" />
  </hover-container>
</template>

<script lang="ts" setup>
import { HoverContainer } from '@/components';
import { useAppStore } from '@/store';
import { useLoading } from '@/hooks';

const { handleReload } = useAppStore();
const { loading, startLoading, endLoading } = useLoading();

function handleRefresh() {
  startLoading();
  handleReload();
  setTimeout(() => {
    endLoading();
  }, 1000);
}
</script>
<style scoped>
.reload-animation {
  animation: rotate 1s;
}
@keyframes rotate {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
