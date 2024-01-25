<script setup lang="ts">
defineOptions({
  name: 'SettingItem'
});

interface Props {
  /** Label */
  label: string;
}

defineProps<Props>();
</script>

<template>
  <div class="flex-y-center justify-between w-full">
    <div>
      <span class="text-base_text pr-8px">{{ label }}</span>
      <slot name="suffix"></slot>
    </div>
    <slot></slot>
  </div>
</template>

<style scoped></style>
