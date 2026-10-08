<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { SButton, SDialog, SForm, SInput, SInputNumber, SSelect, toast, useForm } from '@vean/ui';
import { createDictItem, fetchDictItemById, updateDictItem } from '@/service/api/org-dict';
import type { SelectOption } from '@/composables/use-manage-options';
import { dictItemFormSchema } from '@/schema/form';
import type { DictItemFormDTO } from '@/schema/form';
import { emptyDictItemForm, toDictItemForm } from '@/schema/form-defaults';
import type { DictItemCreateDTO, DictItemUpdateDTO } from '@/schema/org-dict';

/**
 * 字典项新增 / 编辑弹窗（P3-03）。
 */
defineOptions({ name: 'DictItemOperate' });

const props = defineProps<{
  /** 正在编辑的字典项 id；`undefined` 表示为新增 */
  dictItemId?: string;
  /** 字典下拉（`GET /api/dict/all`） */
  dictOptions: SelectOption[];
}>();

const emit = defineEmits<{
  success: [];
}>();

const open = defineModel<boolean>('open', { required: true });

const { t } = useI18n();

const loading = ref(false);

const title = computed(() => (props.dictItemId ? t('manage.editTitle') : t('manage.addTitle')));

const { SFormField, form, handleSubmit, handleReset } = useForm({
  schema: dictItemFormSchema,
  defaultValues: emptyDictItemForm,
  onSubmit: async values => {
    await submit(values);
  }
});

async function submit(values: DictItemFormDTO): Promise<void> {
  loading.value = true;

  try {
    if (props.dictItemId) {
      const body: DictItemUpdateDTO = {
        dictId: values.dictId,
        parentId: values.parentId,
        label: values.label,
        value: values.value,
        order: values.order
      };

      await updateDictItem(props.dictItemId, body);
    } else {
      const body: DictItemCreateDTO = {
        dictId: values.dictId,
        parentId: values.parentId,
        label: values.label,
        value: values.value,
        order: values.order
      };

      await createDictItem(body);
    }

    open.value = false;

    if (props.dictItemId) {
      toast.success(t('manage.updateSuccess'));
    } else {
      toast.success(t('manage.createSuccess'));
    }

    emit('success');
  } finally {
    loading.value = false;
  }
}

async function initForm(id: string | undefined): Promise<void> {
  if (!id) {
    handleReset();
    return;
  }

  loading.value = true;

  try {
    const row = await fetchDictItemById(id);
    form.reset(toDictItemForm(row));
  } finally {
    loading.value = false;
  }
}

watch(
  [open, () => props.dictItemId],
  () => {
    if (open.value) {
      void initForm(props.dictItemId);
    }
  },
  { immediate: true }
);
</script>

<template>
  <SDialog v-model:open="open" :title="title" class="max-w-3xl">
    <SForm class="grid gap-y-6" @submit.prevent="handleSubmit">
      <SFormField name="dictId" :label="t('manage.dictItem.dictId')">
        <SSelect :items="props.dictOptions" />
      </SFormField>

      <SFormField name="label" :label="t('manage.dictItem.label')">
        <SInput :placeholder="t('manage.dictItem.label')" />
      </SFormField>

      <SFormField name="value" :label="t('manage.dictItem.value')">
        <SInput :placeholder="t('manage.dictItem.value')" />
      </SFormField>

      <SFormField name="order" :label="t('manage.field.order')">
        <SInputNumber />
      </SFormField>
    </SForm>

    <template #footer>
      <SButton variant="outline" @click="open = false">{{ t('common.cancel') }}</SButton>
      <SButton :loading="loading" @click="handleSubmit">{{ t('common.confirm') }}</SButton>
    </template>
  </SDialog>
</template>
