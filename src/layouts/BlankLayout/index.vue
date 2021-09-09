<template>
  <n-scrollbar class="h-full" :x-scrollable="true">
    <div class="inline-block w-full min-h-100vh">
      <router-view />
    </div>
  </n-scrollbar>
</template>

<script lang="ts" setup>
import { NScrollbar } from 'naive-ui';
</script>
<style scoped></style>
