<template>
  <div>
    <canvas ref="domRef" width="152" height="40" class="cursor-pointer" @click="getImgCode"></canvas>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useImageVerify } from '@/hooks';

defineOptions({ name: 'ImageVerify' });

interface Props {
  code?: string;
}

const props = withDefaults(defineProps<Props>(), {
  code: ''
});

interface Emits {
  (e: 'update:code', code: string): void;
}

const emit = defineEmits<Emits>();

const { domRef, imgCode, setImgCode, getImgCode } = useImageVerify();

watch(
  () => props.code,
  newValue => {
    setImgCode(newValue);
  }
);
watch(imgCode, newValue => {
  emit('update:code', newValue);
});

defineExpose({ getImgCode });
</script>

<style scoped></style>
