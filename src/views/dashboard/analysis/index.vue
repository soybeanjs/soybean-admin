<template>
  <div class="px-10px">
    <data-card :loading="loading" />
    <nav-card :loading="loading" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { DataCard, NavCard } from './components';

const loading = ref(true);

setTimeout(() => {
  loading.value = false;
}, 1500);
</script>
<style scoped></style>
