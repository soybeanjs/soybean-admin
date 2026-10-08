<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useTransition } from '@vueuse/core';

defineOptions({ name: 'CountTo' });

const props = withDefaults(
  defineProps<{
    /** 目标值 */
    value: number;
    /** 前缀（如货币符号 `$`） */
    prefix?: string;
    /** 动画时长（毫秒） */
    duration?: number;
  }>(),
  {
    prefix: '',
    duration: 1200
  }
);

/**
 * 计数源从 0 起：服务端渲染与首帧必须一致，否则水合时数字会跳变/报 mismatch。
 * 真实值在 `onMounted` 后再喂给 `useTransition` 触发动画。
 */
const source = ref(0);

const output = useTransition(source, { duration: props.duration });

const text = computed(() => `${props.prefix}${output.value}`);

onMounted(() => {
  source.value = props.value;
});

watch(
  () => props.value,
  value => {
    source.value = value;
  }
);
</script>

<template>
  <span>{{ text }}</span>
</template>
