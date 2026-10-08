<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { SButton, SCard, SForm } from '@vean/ui';

/**
 * manage 页搜索卡外壳（P3-03）。
 *
 * 8 套 CRUD 的搜索卡结构一致：`SCard`（标题「搜索」+ 可折叠超出滚动）内含一个
 * 栅格化的 `SForm`，末尾是「重置 / 搜索」两个按钮。差异只在字段本身，因此
 * 字段由页面经默认插槽塞进来，按钮与`<form>` 元素（`type="submit"` 生效的前提）
 * 收敛在这里。
 *
 * **字段组件必须由页面提供**（`SFormField` 的 `name` 依赖页面 `useForm` 的
 * schema 推导），所以本组件只做外壳，不接管表单状态。
 */
defineOptions({ name: 'ManageSearch' });

const props = withDefaults(
  defineProps<{
    /** 提交回调（通常是页面 `useForm` 的 `handleSubmit`） */
    submit: () => void;
    /** 查询请求进行中 */
    loading?: boolean;
    /** 栅格类名，默认 4 列并按断点收敛 */
    gridClass?: string;
  }>(),
  {
    loading: false,
    gridClass: 'cols-4 lt-xl:cols-3 lt-md:cols-2 lt-sm:cols-1'
  }
);

const emit = defineEmits<{
  reset: [];
}>();

const { t } = useI18n();

function onSubmit() {
  props.submit();
}

function onReset() {
  emit('reset');
}
</script>

<template>
  <SCard :title="t('manage.search')" :ui="{ content: 'max-h-70 lt-md:max-h-45 overflow-auto' }">
    <SForm class="grid gap-x-4 gap-y-6" :class="props.gridClass" @submit.prevent="onSubmit">
      <slot />

      <div class="flex items-end justify-end gap-3">
        <SButton type="button" variant="outline" @click="onReset">
          {{ t('common.reset') }}
        </SButton>
        <SButton type="submit" :loading="props.loading">
          {{ t('common.search') }}
        </SButton>
      </div>
    </SForm>
  </SCard>
</template>
