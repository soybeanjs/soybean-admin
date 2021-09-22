<template>
  <div>
    <data-card :loading="loading" />
    <nav-card :loading="loading" />
  </div>
</template>
<script lang="ts" setup>
import { onActivated } from 'vue';
import { useLoading } from '@/hooks';
import { DataCard, NavCard } from './components';

const { loading, startLoading, endLoading } = useLoading(true);

function handleEndLoading() {
  startLoading();
  setTimeout(() => {
    endLoading();
  }, 1000);
}
onActivated(() => {
  handleEndLoading();
});
</script>
<style scoped></style>
