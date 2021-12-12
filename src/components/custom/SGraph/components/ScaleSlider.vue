<template>
  <div class="flex-col-center select-none">
    <icon-mdi-plus-circle
      class="text-20px cursor-pointer"
      :style="{ color: themeColor }"
      @click="handleSliderValue('plus')"
    />
    <div class="h-120px pr-4px">
      <n-slider
        v-model:value="sliderValue"
        :vertical="true"
        :tooltip="false"
        :style="`--rail-color: #efefef;--fill-color:${themeColor};--fill-color-hover:${themeColor}`"
      />
    </div>
    <div class="absolute -right-40px h-20px" :style="{ bottom: sliderLabelBottom }">
      {{ sliderLabel }}
    </div>
    <icon-mdi-minus-circle
      class="text-20px cursor-pointer"
      :style="{ color: themeColor }"
      @click="handleSliderValue('minus')"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { NSlider } from 'naive-ui';
import type { SScaleRange, STranslate } from '@/interface';

interface Props {
  /** 主题颜色 */
  themeColor: string;
  /** 缩放比例 */
  scale?: number;
  /** 缩放范围 */
  scaleRange?: SScaleRange;
}

interface Emits {
  (e: 'update:scale', scale: number): void;
  (e: 'update:translate', translate: STranslate): void;
}

const props = withDefaults(defineProps<Props>(), {
  scale: 1,
  scaleRange: () => [0.2, 3]
});

const emit = defineEmits<Emits>();

const sliderValue = ref(getSliderValue());
const sliderLabel = computed(() => formatSlider(sliderValue.value));
const sliderLabelBottom = computed(() => getSliderLabelBottom(sliderValue.value));

function getSliderValue() {
  const {
    scale,
    scaleRange: [min, max]
  } = props;
  let value = 50;
  if (scale - 1 >= 0) {
    value = ((scale - 1) / (Number(max) - 1)) * 50 + 50;
  } else {
    value = ((scale - Number(min)) / (1 - Number(min))) * 50;
  }
  return value;
}

function getScale(sliderValue: number) {
  const [min, max] = props.scaleRange;
  let scale = 1;
  if (sliderValue >= 50) {
    scale = ((sliderValue - 50) / 50) * (Number(max) - 1) + 1;
  } else {
    scale = (sliderValue / 50) * (1 - Number(min)) + Number(min);
  }
  return scale;
}

function handleSliderValue(type: 'plus' | 'minus') {
  let step = 10;
  if (sliderValue.value >= 50) {
    step = 5;
  }
  if (type === 'minus') {
    step *= -1;
  }
  const newValue = sliderValue.value + step;
  if (newValue >= 0 && newValue <= 100) {
    sliderValue.value = newValue;
  } else {
    sliderValue.value = newValue < 0 ? 0 : 100;
  }
}

function formatSlider(sliderValue: number) {
  const scale = getScale(sliderValue);
  const percent = `${Math.round(scale * 100)}%`;
  return percent;
}

function getSliderLabelBottom(sliderValue: number) {
  return `${19 + (102 * sliderValue) / 100}px`;
}

watch(sliderValue, newValue => {
  const updateScale = getScale(newValue);
  emit('update:scale', updateScale);
});

watch(
  () => props.scale,
  () => {
    sliderValue.value = getSliderValue();
  }
);
</script>
<style scoped>
:deep(.n-slider-rail) {
  width: 4px;
}
</style>
