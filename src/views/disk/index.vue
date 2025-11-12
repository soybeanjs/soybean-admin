<script lang="ts" setup>
import { onMounted } from 'vue';
import { useRouteStore } from '@/store/modules/route';

const routeStore = useRouteStore();

// 网盘页面

onMounted(() => {
  // 初始化当前模块
  window.$message?.info(routeStore.currentModule);
});
</script>

<template>
  <div class="">disk Home</div>
</template>
