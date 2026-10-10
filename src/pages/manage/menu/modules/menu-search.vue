<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { SInput, SSelect, useForm } from '@vean/ui';
import { useManageOptions } from '@/composables/use-manage-options';
import ManageSearch from '@/components/manage-search/index.vue';
import { menuSearchFormSchema } from '@/schema/search';
import type { MenuSearchFormDTO } from '@/schema/search';

/**
 * 菜单搜索卡（P3-03）。
 */
defineOptions({ name: 'MenuSearch' });

const props = defineProps<{
  /** 查询请求进行中 */
  loading?: boolean;
}>();

const emit = defineEmits<{
  search: [values: MenuSearchFormDTO];
  reset: [];
}>();

const { t } = useI18n();
const { enabledSearchOptions, menuTypeSearchOptions } = useManageOptions();

const { SFormField, handleSubmit, handleReset } = useForm({
  schema: menuSearchFormSchema,
  defaultValues: { name: '', code: '', menuType: '', enabled: '' },
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
    <SFormField name="name" :label="t('manage.menu.name')">
      <SInput :placeholder="t('manage.menu.name')" />
    </SFormField>

    <SFormField name="code" :label="t('manage.menu.code')">
      <SInput :placeholder="t('manage.menu.code')" />
    </SFormField>

    <SFormField name="menuType" :label="t('manage.menu.menuType')">
      <SSelect :items="menuTypeSearchOptions" />
    </SFormField>

    <SFormField name="enabled" :label="t('manage.field.enabled')">
      <SSelect :items="enabledSearchOptions" />
    </SFormField>
  </ManageSearch>
</template>
