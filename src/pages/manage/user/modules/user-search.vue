<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { SInput, useForm } from '@vean/ui';
import { useManageOptions } from '@/composables/use-manage-options';
import ManageSearchSelect from '@/components/manage-search-select.vue';
import ManageSearch from '@/components/manage-search/index.vue';
import { userSearchFormSchema } from '@/schema/user';
import type { UserSearchFormDTO } from '@/schema/user';

/** 用户搜索卡（P3-03） 详见 docs/v3-notes.md N-334。 */
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
      <ManageSearchSelect :items="enabledSearchOptions" />
    </SFormField>
  </ManageSearch>
</template>
