<template>
  <p>
    <span>{{ label }}</span>
    <a class="text-blue-500" :href="link" target="_blank">
      {{ link }}
    </a>
  </p>
</template>

<script setup lang="ts">
interface Props {
  /** 网址名称 */
  label: string;
  /** 网址链接 */
  link: string;
}

defineProps<Props>();
</script>
<style scoped></style>
