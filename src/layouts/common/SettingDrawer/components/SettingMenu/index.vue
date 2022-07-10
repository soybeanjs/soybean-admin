<template>
  <div class="flex-y-center justify-between">
    <span>{{ label }}</span>
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
defineOptions({ name: 'SettingMenu' });

interface Props {
  /** 文本 */
  label: string;
}

defineProps<Props>();
</script>

<style scoped></style>
