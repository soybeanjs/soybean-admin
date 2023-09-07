<template>
  <hover-container class="w-64px h-full" tooltip-content="重新加载" placement="bottom-end" @click="handleRefresh">
    <icon-mdi-refresh class="text-22px" :class="{ 'animate-spin': loading }" />
  </hover-container>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useRouteStore } from '@/store';
import { useLoading } from '@/hooks';

defineOptions({ name: 'ReloadButton' });

const { reCacheRoute } = useRouteStore();
const route = useRoute();
const { loading, startLoading, endLoading } = useLoading();

async function handleRefresh() {
  startLoading();

  await reCacheRoute(route.name as AuthRoute.AllRouteKey);

  setTimeout(() => {
    endLoading();
  }, 1000);
}
</script>

<style scoped></style>
