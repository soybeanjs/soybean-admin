<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { SInput, SSelect, useForm } from '@vean/ui';
import { useManageOptions } from '@/composables/use-manage-options';
import ManageSearch from '@/components/manage-search/index.vue';
import { roleSearchFormSchema } from '@/schema/search';
import type { RoleSearchFormDTO } from '@/schema/search';

/**
 * 角色搜索卡（P3-03）。
 */
defineOptions({ name: 'RoleSearch' });

const props = defineProps<{
  /** 查询请求进行中 */
  loading?: boolean;
}>();

const emit = defineEmits<{
  search: [values: RoleSearchFormDTO];
  reset: [];
}>();

const { t } = useI18n();
const { enabledSearchOptions } = useManageOptions();

const { SFormField, handleSubmit, handleReset } = useForm({
  schema: roleSearchFormSchema,
  defaultValues: { name: '', code: '', enabled: '' },
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
    <SFormField name="name" :label="t('manage.role.name')">
      <SInput :placeholder="t('manage.role.name')" />
    </SFormField>

    <SFormField name="code" :label="t('manage.role.code')">
      <SInput :placeholder="t('manage.role.code')" />
    </SFormField>

    <SFormField name="enabled" :label="t('manage.field.enabled')">
      <SSelect :items="enabledSearchOptions" />
    </SFormField>
  </ManageSearch>
</template>
