<template>
  <div class="h-full">
    <iframe class="wh-full" :src="src"></iframe>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const src = ref('https://cn.vitejs.dev/');
</script>

<style scoped></style>
