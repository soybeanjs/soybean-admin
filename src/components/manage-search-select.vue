<script setup lang="ts">
import { computed } from 'vue';
import { SSelect } from '@vean/ui';
import type { SelectOptionData } from '@vean/ui';
import { fromSelectValue, toSelectValue } from '@/composables/use-manage-options';
import type { SelectOption } from '@/composables/use-manage-options';

/**
 * 搜索卡里的枚举下拉（P3-03 修正）。
 *
 * 存在的唯一理由是 `@vean/aria` 把**空串**保留给「未选择」语义：
 * `shouldShowPlaceholder(v)` 判定 `isNullish(v) || v === '' || []`，且
 * `SelectItem` 在 `setup` 里对 `value === ''` 直接抛错。而搜索表单的
 * 「全部」在数据层就是空串（schema 值域、表单默认值、`filterValidQuery`
 * 三处都以空串为准），两者冲突。
 *
 * 折中方案：**数据层不动**，只在渲染边界换一个非空哨兵值
 * （`SEARCH_ANY_SELECT_VALUE`）。转换集中在 `toSelectValue` / `fromSelectValue`，
 * 页面里写 `<ManageSearchSelect :items="enabledSearchOptions" />` 即可 ——
 * `modelValue` / `update:modelValue` 由 `SFormField` 的默认插槽（`Slot` 原语）
 * 注入，这里声明成 props/emits 后就不会再透传到 `SSelect` 上，
 * 因此不存在「原始值绕过转换写回表单」的问题。
 *
 * 不要在页面里直接用 `SSelect` 渲染带「全部」的选项表：那样「全部」这一项
 * 挂载即抛错（控制台满屏报错），且选中具体枚举值后再也回不到「全部」。
 */
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
