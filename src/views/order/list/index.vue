<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();
function handleToDetail() {
  router.push('/order/detail');
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <NButton size="large" @click="handleToDetail">跳转详情</NButton>
    <ul>
      <li v-for="item in 100" :key="item">{{ item }}</li>
    </ul>
  </div>
</template>
