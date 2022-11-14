<template>
  <span>{{ value }}</span>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref, watch, watchEffect } from 'vue';
import { TransitionPresets, useTransition } from '@vueuse/core';
import { isNumber } from '@/utils';

defineOptions({ name: 'CountTo' });

type TansitionKey = keyof typeof TransitionPresets;

interface Props {
  /** 初始值 */
  startValue?: number;
  /** 结束值 */
  endValue?: number;
  /** 动画时长 */
  duration?: number;
  /** 自动动画 */
  autoplay?: boolean;
  /** 进制 */
  decimals?: number;
  /** 前缀 */
  prefix?: string;
  /** 后缀 */
  suffix?: string;
  /** 分割符号 */
  separator?: string;
  /** 小数点 */
  decimal?: string;
  /** 使用缓冲动画函数 */
  useEasing?: boolean;
  /** 缓冲动画函数类型 */
  transition?: TansitionKey;
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

interface Emits {
  (e: 'on-started'): void;
  (e: 'on-finished'): void;
}

const emit = defineEmits<Emits>();

const source = ref(props.startValue);
let outputValue = useTransition(source);
const value = computed(() => formatNumber(outputValue.value));
const disabled = ref(false);

function run() {
  outputValue = useTransition(source, {
    disabled,
    duration: props.duration,
    onStarted: () => emit('on-started'),
    onFinished: () => emit('on-finished'),
    ...(props.useEasing ? { transition: TransitionPresets[props.transition] } : {})
  });
}

function start() {
  run();
  source.value = props.endValue;
}

function formatNumber(num: number | string) {
  if (num !== 0 && !num) {
    return '';
  }
  const { decimals, decimal, separator, suffix, prefix } = props;
  let number = Number(num).toFixed(decimals);
  number = String(number);

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

watch([() => props.startValue, () => props.endValue], () => {
  if (props.autoplay) {
    start();
  }
});

watchEffect(() => {
  source.value = props.startValue;
});

onMounted(() => {
  if (props.autoplay) {
    start();
  }
});
</script>

<style scoped></style>
