<template>
  <div class="p-10px">
    <data-card :loading="loading" />
    <nav-card :loading="loading" />
    <router-link :to="EnumRoutePath['dashboard-workbench']">workbench</router-link>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { DataCard, NavCard } from './components';
import { EnumRoutePath } from '@/enum';

const loading = ref(true);

setTimeout(() => {
  loading.value = false;
}, 1500);
</script>
<style scoped></style>
