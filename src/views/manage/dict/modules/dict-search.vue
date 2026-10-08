<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { SInput, SSelect, useForm } from '@vean/ui';
import { useManageOptions } from '@/composables/use-manage-options';
import ManageSearch from '@/components/manage-search/index.vue';
import { dictSearchFormSchema } from '@/schema/search';
import type { DictSearchFormDTO } from '@/schema/search';

/**
 * 字典搜索卡（P3-03）。
 */
defineOptions({ name: 'DictSearch' });

const props = defineProps<{
  /** 查询请求进行中 */
  loading?: boolean;
}>();

const emit = defineEmits<{
  search: [values: DictSearchFormDTO];
  reset: [];
}>();

const { t } = useI18n();
const { yesOrNoSearchOptions } = useManageOptions();

const { SFormField, handleSubmit, handleReset } = useForm({
  schema: dictSearchFormSchema,
  defaultValues: { name: '', code: '', isSystem: '' },
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
    <SFormField name="name" :label="t('manage.dict.name')">
      <SInput :placeholder="t('manage.dict.name')" />
    </SFormField>

    <SFormField name="code" :label="t('manage.dict.code')">
      <SInput :placeholder="t('manage.dict.code')" />
    </SFormField>

    <SFormField name="isSystem" :label="t('manage.dict.isSystem')">
      <SSelect :items="yesOrNoSearchOptions" />
    </SFormField>
  </ManageSearch>
</template>
