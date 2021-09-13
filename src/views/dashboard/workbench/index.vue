<template>
  <div>
    <h2>工作台</h2>
    <router-link :to="EnumRoutePath['dashboard-analysis']">analysis</router-link>
    <n-button @click="removeCurrent">去除</n-button>
  </div>
</template>

<script lang="ts" setup>
import { NButton } from 'naive-ui';
import { useRouter } from 'vue-router';
import { EnumRoutePath } from '@/enum';
import { RouteNameMap } from '@/router';

const router = useRouter();

function removeCurrent() {
  router.removeRoute(RouteNameMap.get('dashboard-workbench')!);
}
</script>
<style scoped></style>
