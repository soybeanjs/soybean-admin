<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { TransitionPresets, useTransition } from '@vueuse/core';

defineOptions({
  name: 'CountTo'
});

interface Props {
  startValue?: number;
  endValue?: number;
  duration?: number;
  autoplay?: boolean;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  separator?: string;
  decimal?: string;
  useEasing?: boolean;
  transition?: keyof typeof TransitionPresets;
}

const props = withDefaults(defineProps<Props>(), {
  startValue: 0,
  endValue: 2021,
  duration: 1500,
  autoplay: true,
  decimals: 0,
  prefix: '',
  suffix: '',
  separator: ',',
  decimal: '.',
  useEasing: true,
  transition: 'linear'
});

const source = ref(props.startValue);

const transition = computed(() => (props.useEasing ? TransitionPresets[props.transition] : undefined));

const outputValue = useTransition(source, {
  disabled: false,
  duration: props.duration,
  transition: transition.value
});

const value = computed(() => formatValue(outputValue.value));

function formatValue(num: number) {
  const { decimals, decimal, separator, suffix, prefix } = props;

  let number = num.toFixed(decimals);
  number = String(number);

  const x = number.split('.');
  let x1 = x[0];
  const x2 = x.length > 1 ? decimal + x[1] : '';
  const rgx = /(\d+)(\d{3})/;
  if (separator) {
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, `$1${separator}$2`);
    }
  }

  return prefix + x1 + x2 + suffix;
}

async function start() {
  await nextTick();
  source.value = props.endValue;
}

watch(
  [() => props.startValue, () => props.endValue],
  () => {
    if (props.autoplay) {
      start();
    }
  },
  { immediate: true }
);
</script>

<template>
  <span>{{ value }}</span>
</template>

<style scoped></style>
