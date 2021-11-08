<template>
  <p>
    <span>github地址：</span>
    <a class="text-blue-500" :href="link" target="_blank">
      {{ link }}
    </a>
  </p>
</template>

<script setup lang="ts">
interface Props {
  /** github链接 */
  link: string;
}

defineProps<Props>();
</script>
<style scoped></style>
