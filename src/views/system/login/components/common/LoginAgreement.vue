<template>
  <div class="w-full text-[14px]">
    <n-checkbox v-model:checked="checked">我已经仔细阅读并接受</n-checkbox>
    <n-button :text="true" type="primary">《用户协议》</n-button>
    <n-button :text="true" type="primary">《隐私权政策》</n-button>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { NCheckbox, NButton } from 'naive-ui';
import { useBoolean } from '@/hooks';

interface Props {
  /** 是否选中 */
  value: boolean;
}

interface Emits {
  (e: 'update:value', value: boolean): void;
}

const props = withDefaults(defineProps<Props>(), {
  value: true
});

const emit = defineEmits<Emits>();

const { bool: checked, setBool } = useBoolean(props.value);

watch(
  () => props.value,
  newValue => {
    setBool(newValue);
  }
);
watch(checked, newValue => {
  emit('update:value', newValue);
});
</script>
<style scoped></style>
