<script setup lang="ts">
import { onActivated } from 'vue';

console.log('setup');

onActivated(() => {
  console.log('onActivated');
});
</script>

<template>
  <LookForward />
</template>

<style scoped></style>
