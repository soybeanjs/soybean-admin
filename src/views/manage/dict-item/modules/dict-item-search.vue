<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { SInput, SSelect, useForm } from '@vean/ui';
import type { SelectOption } from '@/composables/use-manage-options';
import ManageSearch from '@/components/manage-search/index.vue';
import { dictItemSearchFormSchema } from '@/schema/search';
import type { DictItemSearchFormDTO } from '@/schema/search';

/**
 * 字典项搜索卡（P3-03）。
 *
 * `initialDictId` 来自 URL 的 `?dictId=`（字典页「查看字典项」入口），作为
 * `defaultValues` 的初值 —— 这样「重置」也会回到该筛选，符合从字典页跳过来的
 * 语境。
 */
defineOptions({ name: 'DictItemSearch' });

const props = defineProps<{
  /** 查询请求进行中 */
  loading?: boolean;
  /** 字典下拉（`GET /api/dict/all`） */
  dictOptions: SelectOption[];
  /** URL 预置的 dictId */
  initialDictId?: string;
}>();

const emit = defineEmits<{
  search: [values: DictItemSearchFormDTO];
  reset: [];
}>();

const { t } = useI18n();

const { SFormField, handleSubmit, handleReset } = useForm({
  schema: dictItemSearchFormSchema,
  defaultValues: { dictId: props.initialDictId ?? '', label: '', value: '' },
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
    <SFormField name="dictId" :label="t('manage.dictItem.dictId')">
      <SSelect :items="props.dictOptions" />
    </SFormField>

    <SFormField name="label" :label="t('manage.dictItem.label')">
      <SInput :placeholder="t('manage.dictItem.label')" />
    </SFormField>

    <SFormField name="value" :label="t('manage.dictItem.value')">
      <SInput :placeholder="t('manage.dictItem.value')" />
    </SFormField>
  </ManageSearch>
</template>
