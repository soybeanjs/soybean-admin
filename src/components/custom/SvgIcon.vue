<template>
  <svg aria-hidden="true" width="1em" height="1em" class="inline-block">
    <use :xlink:href="symbolId" fill="currentColor" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  /** 前缀 */
  prefix?: string;
  /** 图标名称(图片的文件名) */
  icon: string;
}

const props = withDefaults(defineProps<Props>(), {
  prefix: 'icon-custom'
});

const symbolId = computed(() => `#${props.prefix}-${props.icon}`);
</script>

<style scoped></style>
