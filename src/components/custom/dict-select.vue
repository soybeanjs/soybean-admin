<script setup lang="ts">
import { useAttrs } from 'vue';
import type { SelectProps } from 'naive-ui';
import { useDict } from '@/hooks/business/dict';

defineOptions({ name: 'DictSelect' });

interface Props {
  dictCode: string;
  immediate?: boolean;
  multiple?: boolean;
  [key: string]: any;
}

const props = withDefaults(defineProps<Props>(), {
  immediate: false,
  multiple: false
});

const value = defineModel<string | string[] | null>('value', { required: false });

const attrs: SelectProps = useAttrs();
const { options } = useDict(props.dictCode, props.immediate);
</script>

<template>
  <NSelect
    v-model:value="value"
    :multiple="multiple"
    :loading="!options.length"
    :options="options"
    :clear-filter-after-select="false"
    v-bind="attrs"
  />
</template>

<style scoped></style>
