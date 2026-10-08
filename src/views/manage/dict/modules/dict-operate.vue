<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { SButton, SDialog, SForm, SInput, SSelect, STextarea, toast, useForm } from '@vean/ui';
import { createDict, fetchDictById, updateDict } from '@/service/api/org-dict';
import { useManageOptions } from '@/composables/use-manage-options';
import { dictFormSchema } from '@/schema/form';
import type { DictFormDTO } from '@/schema/form';
import { emptyDictForm, toDictForm } from '@/schema/form-defaults';
import type { DictCreateDTO, DictUpdateDTO } from '@/schema/org-dict';

/**
 * 字典新增 / 编辑弹窗（P3-03）。
 */
defineOptions({ name: 'DictOperate' });

const props = defineProps<{
  /** 正在编辑的字典 id；`undefined` 表示为新增 */
  dictId?: string;
}>();

const emit = defineEmits<{
  success: [];
}>();

const open = defineModel<boolean>('open', { required: true });

const { t } = useI18n();
const { yesOrNoOptions } = useManageOptions();

const loading = ref(false);

const title = computed(() => (props.dictId ? t('manage.editTitle') : t('manage.addTitle')));

const { SFormField, form, handleSubmit, handleReset } = useForm({
  schema: dictFormSchema,
  defaultValues: emptyDictForm,
  onSubmit: async values => {
    await submit(values);
  }
});

async function submit(values: DictFormDTO): Promise<void> {
  loading.value = true;

  try {
    if (props.dictId) {
      const body: DictUpdateDTO = {
        name: values.name,
        code: values.code,
        isSystem: values.isSystem,
        description: values.description
      };

      await updateDict(props.dictId, body);
    } else {
      const body: DictCreateDTO = {
        name: values.name,
        code: values.code,
        isSystem: values.isSystem,
        description: values.description
      };

      await createDict(body);
    }

    open.value = false;

    if (props.dictId) {
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
    const row = await fetchDictById(id);
    form.reset(toDictForm(row));
  } finally {
    loading.value = false;
  }
}

watch(
  [open, () => props.dictId],
  () => {
    if (open.value) {
      void initForm(props.dictId);
    }
  },
  { immediate: true }
);
</script>

<template>
  <SDialog v-model:open="open" :title="title" class="max-w-3xl">
    <SForm class="grid gap-y-6" @submit.prevent="handleSubmit">
      <SFormField name="name" :label="t('manage.dict.name')">
        <SInput :placeholder="t('manage.dict.name')" />
      </SFormField>

      <SFormField name="code" :label="t('manage.dict.code')">
        <SInput :placeholder="t('manage.dict.code')" />
      </SFormField>

      <SFormField name="isSystem" :label="t('manage.dict.isSystem')">
        <SSelect :items="yesOrNoOptions" />
      </SFormField>

      <SFormField name="description" :label="t('manage.field.description')">
        <STextarea :placeholder="t('manage.field.description')" />
      </SFormField>
    </SForm>

    <template #footer>
      <SButton variant="outline" @click="open = false">{{ t('common.cancel') }}</SButton>
      <SButton :loading="loading" @click="handleSubmit">{{ t('common.confirm') }}</SButton>
    </template>
  </SDialog>
</template>
