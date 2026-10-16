<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { SInput, useForm } from '@vean/ui';
import { useManageOptions } from '@/composables/use-manage-options';
import ManageSearchSelect from '@/components/manage-search-select.vue';
import ManageSearch from '@/components/manage-search/index.vue';
import { apiSearchFormSchema } from '@/schema/api';
import type { ApiSearchFormDTO } from '@/schema/api';

/** 接口搜索卡（P3-03） 详见 docs/v3-notes.md N-318。 */
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
      <ManageSearchSelect :items="apiMethodSearchOptions" />
    </SFormField>
  </ManageSearch>
</template>
