<script setup lang="ts">
import Simplebar from 'simplebar-vue';
import 'simplebar-vue/dist/simplebar.min.css';

defineOptions({
  name: 'SimpleScrollbar'
});
</script>

<template>
  <div class="h-full flex-1-hidden">
    <Simplebar class="h-full">
      <slot />
    </Simplebar>
  </div>
</template>

<style scoped></style>
