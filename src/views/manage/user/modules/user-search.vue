<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { SInput, SSelect, useForm } from '@vean/ui';
import { useManageOptions } from '@/composables/use-manage-options';
import ManageSearch from '@/components/manage-search/index.vue';
import { userSearchFormSchema } from '@/schema/search';
import type { UserSearchFormDTO } from '@/schema/search';

/**
 * 用户搜索卡（P3-03）。
 *
 * `useForm` 在这里调用（`SFormField` 靠它的 `provide` 解析字段类型），
 * 提交/重置后把值交给父级页面去合并进表格 query。
 */
defineOptions({ name: 'UserSearch' });

const props = defineProps<{
  /** 查询请求进行中 */
  loading?: boolean;
}>();

const emit = defineEmits<{
  search: [values: UserSearchFormDTO];
  reset: [];
}>();

const { t } = useI18n();
const { enabledSearchOptions } = useManageOptions();

const { SFormField, handleSubmit, handleReset } = useForm({
  schema: userSearchFormSchema,
  defaultValues: { username: '', phone: '', email: '', fullName: '', enabled: '' },
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
    <SFormField name="username" :label="t('manage.user.username')">
      <SInput :placeholder="t('manage.user.username')" />
    </SFormField>

    <SFormField name="fullName" :label="t('manage.user.fullName')">
      <SInput :placeholder="t('manage.user.fullName')" />
    </SFormField>

    <SFormField name="phone" :label="t('manage.user.phone')">
      <SInput :placeholder="t('manage.user.phone')" />
    </SFormField>

    <SFormField name="email" :label="t('manage.user.email')">
      <SInput :placeholder="t('manage.user.email')" />
    </SFormField>

    <SFormField name="enabled" :label="t('manage.field.enabled')">
      <SSelect :items="enabledSearchOptions" />
    </SFormField>
  </ManageSearch>
</template>
