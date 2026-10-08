<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { SInput, useForm } from '@vean/ui';
import ManageSearch from '@/components/manage-search/index.vue';
import { orgSearchFormSchema } from '@/schema/search';
import type { OrgSearchFormDTO } from '@/schema/search';

/**
 * 组织搜索卡（P3-03）。
 */
defineOptions({ name: 'OrgSearch' });

const props = defineProps<{
  /** 查询请求进行中 */
  loading?: boolean;
}>();

const emit = defineEmits<{
  search: [values: OrgSearchFormDTO];
  reset: [];
}>();

const { t } = useI18n();

const { SFormField, handleSubmit, handleReset } = useForm({
  schema: orgSearchFormSchema,
  defaultValues: { name: '', code: '' },
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
    <SFormField name="name" :label="t('manage.org.name')">
      <SInput :placeholder="t('manage.org.name')" />
    </SFormField>

    <SFormField name="code" :label="t('manage.org.code')">
      <SInput :placeholder="t('manage.org.code')" />
    </SFormField>
  </ManageSearch>
</template>
