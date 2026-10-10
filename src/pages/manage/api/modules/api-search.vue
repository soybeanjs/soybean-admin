<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { SInput, SSelect, useForm } from '@vean/ui';
import { useManageOptions } from '@/composables/use-manage-options';
import ManageSearch from '@/components/manage-search/index.vue';
import { apiSearchFormSchema } from '@/schema/search';
import type { ApiSearchFormDTO } from '@/schema/search';

/**
 * 接口搜索卡（P3-03）。
 *
 * `useForm` 在这里调用（`SFormField` 靠它的 `provide` 解析字段类型），
 * 提交/重置后把值交给父级页面去合并进表格 query。
 */
defineOptions({ name: 'ApiSearch' });

const props = defineProps<{
  /** 查询请求进行中 */
  loading?: boolean;
}>();

const emit = defineEmits<{
  search: [values: ApiSearchFormDTO];
  reset: [];
}>();

const { t } = useI18n();
const { apiMethodSearchOptions } = useManageOptions();

const { SFormField, handleSubmit, handleReset } = useForm({
  schema: apiSearchFormSchema,
  defaultValues: { name: '', path: '', method: '' },
  onSubmit: values => {
    emit('search', values);
  }
});

function onReset() {
  handleReset();
  emit('reset');
}
</script>

<template>
  <ManageSearch :loading="props.loading" :submit="handleSubmit" @reset="onReset">
    <SFormField name="name" :label="t('manage.api.name')">
      <SInput :placeholder="t('manage.api.name')" />
    </SFormField>

    <SFormField name="path" :label="t('manage.api.path')">
      <SInput :placeholder="t('manage.api.path')" />
    </SFormField>

    <SFormField name="method" :label="t('manage.api.method')">
      <SSelect :items="apiMethodSearchOptions" />
    </SFormField>
  </ManageSearch>
</template>
