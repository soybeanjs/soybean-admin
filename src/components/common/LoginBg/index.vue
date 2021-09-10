<template>
  <div class="absolute-lt w-full h-full overflow-hidden">
    <div class="absolute -right-300px -top-900px">
      <corner-top />
    </div>
    <div class="absolute -left-200px -bottom-400px">
      <corner-bottom />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { CornerTop, CornerBottom } from './components';
</script>
<style scoped></style>
