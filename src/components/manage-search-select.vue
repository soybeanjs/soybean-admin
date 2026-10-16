<script setup lang="ts">
import { computed } from 'vue';
import { SSelect } from '@vean/ui';
import type { SelectOptionData } from '@vean/ui';
import { fromSelectValue, toSelectValue } from '@/composables/use-manage-options';
import type { SelectOption } from '@/composables/use-manage-options';

/** 存在的唯一理由是 `@vean/aria` 把**空串**保留给「未选择」语义： 详见 docs/v3-notes.md N-038。 */
defineOptions({ name: 'ManageSearchSelect' });

const props = withDefaults(
  defineProps<{
    /** 选项表（`useManageOptions` 产出的 `*SearchOptions`） */
    items: SelectOption[];
    /** 表单值：空串表示「全部」 */
    modelValue?: string;
  }>(),
  {
    modelValue: ''
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

/** `SelectOption` 与 `SSelect` 的选项形状同构，此处只做可变数组的类型对齐 */
const selectItems = computed<SelectOptionData[]>(() => props.items);

/** 空串 ↔ 哨兵值的转换只发生在这一层 */
const selectValue = computed({
  get: () => toSelectValue(props.modelValue),
  set: value => emit('update:modelValue', fromSelectValue(value))
});
</script>

<template>
  <SSelect v-model="selectValue" :items="selectItems" />
</template>
