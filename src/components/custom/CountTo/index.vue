<template>
  <span>{{ value }}</span>
</template>
<script lang="ts" setup>
import { ref, computed, onMounted, watch, watchEffect } from 'vue';
import { useTransition, TransitionPresets } from '@vueuse/core';
import { isNumber } from '@/utils';

const props = defineProps({
  startValue: {
    type: Number,
    default: 0
  },
  endValue: {
    type: Number,
    default: 2021
  },
  duration: {
    type: Number,
    default: 1500
  },
  autoplay: {
    type: Boolean,
    default: true
  },
  decimals: {
    type: Number,
    default: 0,
    validator(value: number) {
      return value >= 0;
    }
  },
  prefix: {
    type: String,
    default: ''
  },
  suffix: {
    type: String,
    default: ''
  },
  separator: {
    type: String,
    default: ','
  },
  decimal: {
    type: String,
    default: '.'
  },
  useEasing: {
    type: Boolean,
    default: true
  },
  transition: {
    type: String,
    default: 'linear'
  }
});
const emit = defineEmits(['on-started', 'on-finished']);

const source = ref(props.startValue);
const disabled = ref(false);
let outputValue = useTransition(source);
const value = computed(() => formatNumber(outputValue.value));

watchEffect(() => {
  source.value = props.startValue;
});
watch([() => props.startValue, () => props.endValue], () => {
  if (props.autoplay) {
    start();
  }
});
onMounted(() => {
  if (props.autoplay) {
    start();
  }
});

function start() {
  run();
  source.value = props.endValue;
}

// function reset() {
//   source.value = props.startValue;
//   run();
// }

function run() {
  outputValue = useTransition(source, {
    disabled,
    duration: props.duration,
    onStarted: () => emit('on-started'),
    onFinished: () => emit('on-finished'),
    ...(props.useEasing ? { transition: TransitionPresets[props.transition] } : {})
  });
}

function formatNumber(num: number | string) {
  if (!num) {
    return '';
  }
  const { decimals, decimal, separator, suffix, prefix } = props;
  let number = Number(num).toFixed(decimals);
  number += '';

  const x = number.split('.');
  let x1 = x[0];
  const x2 = x.length > 1 ? decimal + x[1] : '';
  const rgx = /(\d+)(\d{3})/;
  if (separator && !isNumber(separator)) {
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, `$1${separator}$2`);
    }
  }
  return prefix + x1 + x2 + suffix;
}
</script>
