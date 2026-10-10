<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { SInput, SSelect, useForm } from '@vean/ui';
import { useManageOptions } from '@/composables/use-manage-options';
import ManageSearch from '@/components/manage-search/index.vue';
import { permissionSearchFormSchema } from '@/schema/search';
import type { PermissionSearchFormDTO } from '@/schema/search';

/**
 * 权限搜索卡（P3-03）。
 */
defineOptions({ name: 'PermissionSearch' });

const props = defineProps<{
  /** 查询请求进行中 */
  loading?: boolean;
}>();

const emit = defineEmits<{
  search: [values: PermissionSearchFormDTO];
  reset: [];
}>();

const { t } = useI18n();
const { enabledSearchOptions, resourceTypeSearchOptions } = useManageOptions();

const { SFormField, handleSubmit, handleReset } = useForm({
  schema: permissionSearchFormSchema,
  defaultValues: { name: '', code: '', resourceType: '', enabled: '' },
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
    <SFormField name="name" :label="t('manage.permission.name')">
      <SInput :placeholder="t('manage.permission.name')" />
    </SFormField>

    <SFormField name="code" :label="t('manage.permission.code')">
      <SInput :placeholder="t('manage.permission.code')" />
    </SFormField>

    <SFormField name="resourceType" :label="t('manage.permission.resourceType')">
      <SSelect :items="resourceTypeSearchOptions" />
    </SFormField>

    <SFormField name="enabled" :label="t('manage.field.enabled')">
      <SSelect :items="enabledSearchOptions" />
    </SFormField>
  </ManageSearch>
</template>
