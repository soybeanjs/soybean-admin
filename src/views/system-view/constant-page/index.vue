<template>
  <div class="wh-full flex-col-center">
    <n-gradient-text class="mb-24px" type="primary" :size="28">Custom Constant Page</n-gradient-text>
    <router-link :to="{ name: routeHomePath }">
      <n-button type="primary">回到首页</n-button>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { routeName } from '@/router';

const routeHomePath = routeName('root');
</script>

<style scoped></style>
