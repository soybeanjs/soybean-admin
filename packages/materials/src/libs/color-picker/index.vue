<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import ColorPicker from '@simonwep/pickr';
import '@simonwep/pickr/dist/themes/nano.min.css';

defineOptions({
  name: 'ColorPicker'
});

const props = withDefaults(defineProps<Props>(), {
  palettes: () => [
    '#3b82f6',
    '#6366f1',
    '#8b5cf6',
    '#a855f7',
    '#0ea5e9',
    '#06b6d4',
    '#f43f5e',
    '#ef4444',
    '#ec4899',
    '#d946ef',
    '#f97316',
    '#f59e0b',
    '#eab308',
    '#84cc16',
    '#22c55e',
    '#10b981',
    '#14b8a6'
  ]
});

const emit = defineEmits<Emits>();

interface Props {
  color: string;
  palettes?: string[];
  disabled?: boolean;
}

interface Emits {
  (e: 'update:color', value: string): void;
}

const domRef = ref<HTMLElement | null>(null);
const instance = ref<ColorPicker | null>(null);

function handleColorChange(hsva: ColorPicker.HSVaColor) {
  const color = hsva.toHEXA().toString();
  emit('update:color', color);
}

function initColorPicker() {
  if (!domRef.value) return;

  instance.value = ColorPicker.create({
    el: domRef.value,
    theme: 'nano',
    swatches: props.palettes,
    lockOpacity: true,
    default: props.color,
    disabled: props.disabled,
    components: {
      preview: true,
      opacity: false,
      hue: true,
      interaction: {
        hex: true,
        rgba: true,
        input: true
      }
    }
  });

  instance.value.on('change', handleColorChange);
}

function updateColor(color: string) {
  if (!instance.value) return;

  instance.value.setColor(color);
}

function updateDisabled(disabled: boolean) {
  if (!instance.value) return;

  if (disabled) {
    instance.value.disable();
  } else {
    instance.value.enable();
  }
}

watch(
  () => props.color,
  value => {
    updateColor(value);
  }
);

watch(
  () => props.disabled,
  value => {
    updateDisabled(value);
  }
);

onMounted(() => {
  initColorPicker();
});
</script>

<template>
  <div ref="domRef"></div>
</template>

<style scoped></style>
