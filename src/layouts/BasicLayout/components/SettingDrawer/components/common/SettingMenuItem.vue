<template>
  <div class="flex-y-center justify-between">
    <span>{{ label }}</span>
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  label: {
    type: String,
    default: ''
  }
});
</script>
<style scoped></style>
