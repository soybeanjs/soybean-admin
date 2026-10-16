<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { SButton, SDialog, SForm, SInput, SSelect, STextarea, toast, useForm } from '@vean/ui';
import { useManageOptions } from '@/composables/use-manage-options';
import { api } from '@/request';
import { apiFormSchema, emptyApiForm, toApiForm } from '@/schema/api';
import type { ApiUpdateDTO, ApiFormDTO } from '@/schema/api';

/** 8 套 operate 弹窗同形，本文件是**参照实现**： 详见 docs/v3-notes.md N-317。 */
defineOptions({ name: 'ApiOperate' });

const props = defineProps<{
  /** 正在编辑的接口 id；`undefined` 表示为新增 */
  apiId?: string;
}>();

const emit = defineEmits<{
  success: [];
}>();

const open = defineModel<boolean>('open', { required: true });

const { t } = useI18n();

const { apiMethodOptions } = useManageOptions();

/** 提交中（详情拉取也计入，避免"回填未完成就能提交空表"） */
const loading = ref(false);

const title = computed(() => (props.apiId ? t('manage.editTitle') : t('manage.addTitle')));

const { SFormField, form, handleSubmit, handleReset } = useForm({
  schema: apiFormSchema,
  defaultValues: emptyApiForm,
  onSubmit: async values => {
    await submit(values);
  }
});

/** 详情拉取失败时不提交（`flat` 通道不存在，异常由请求层统一提示） */
async function submit(values: ApiFormDTO): Promise<void> {
  loading.value = true;

  try {
    if (props.apiId) {
      const body: ApiUpdateDTO = {
        name: values.name,
        path: values.path,
        method: values.method,
        description: values.description
      };
      await api.put('/api/{id}', { pathParams: { id: props.apiId }, body });
    } else {
      await api.post('/api', { body: values });
    }

    open.value = false;

    if (props.apiId) {
      toast.success(t('manage.updateSuccess'));
    } else {
      toast.success(t('manage.createSuccess'));
    }

    emit('success');
  } finally {
    loading.value = false;
  }
}

/** 新增：重置为表单初值；编辑：拉详情后回填 */
async function initForm(id: string | undefined): Promise<void> {
  if (!id) {
    handleReset();
    return;
  }

  loading.value = true;

  try {
    const row = await api.get('/api/{id}', { pathParams: { id } });

    if (row) form.reset(toApiForm(row));
  } finally {
    loading.value = false;
  }
}

watch(
  [open, () => props.apiId],
  () => {
    if (open.value) {
      void initForm(props.apiId);
    }
  },
  { immediate: true }
);
</script>

<template>
  <SDialog v-model:open="open" :title="title" class="max-w-3xl">
    <SForm class="grid gap-y-6" @submit.prevent="handleSubmit">
      <SFormField name="name" :label="t('manage.api.name')">
        <SInput :placeholder="t('manage.api.name')" />
      </SFormField>

      <SFormField name="path" :label="t('manage.api.path')">
        <SInput :placeholder="t('manage.api.path')" />
      </SFormField>

      <SFormField name="method" :label="t('manage.api.method')">
        <SSelect :items="apiMethodOptions" />
      </SFormField>

      <SFormField name="description" :label="t('manage.api.description')">
        <STextarea :placeholder="t('manage.api.description')" />
      </SFormField>
    </SForm>

    <template #footer>
      <SButton variant="outline" @click="open = false">{{ t('common.cancel') }}</SButton>
      <SButton :loading="loading" @click="handleSubmit">{{ t('common.confirm') }}</SButton>
    </template>
  </SDialog>
</template>
