<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { SButton, SDialog, SForm, SInput, SSelect, STextarea, toast, useForm } from '@vean/ui';
import { createApi, fetchApiById, updateApi } from '@/service/api/api';
import { useManageOptions } from '@/composables/use-manage-options';
import type { ApiUpdateDTO } from '@/schema/api';
import { apiFormSchema } from '@/schema/form';
import type { ApiFormDTO } from '@/schema/form';
import { emptyApiForm, toApiForm } from '@/schema/form-defaults';

/**
 * 接口新增 / 编辑弹窗（P3-03）。
 *
 * 8 套 operate 弹窗同形，本文件是**参照实现**：
 * 1. `operateId` 变化 → 拉详情（编辑）或 `form.reset(空表)`（新增）；
 * 2. `useForm({schema, defaultValues})` 的 `defaultValues` 在**组合时**固化，
 *    所以回填只能走 `form.reset(values)`（TanStack 的 `reset` 会把
 *    `defaultValues` 一并替换成新值，见 `FormApi.js:127`）；
 * 3. 提交成功后 `open=false` + `toast.success` + `emit('success')` 通知列表刷新。
 */
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
      await updateApi(props.apiId, body);
    } else {
      await createApi(values);
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
    const row = await fetchApiById(id);
    form.reset(toApiForm(row));
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
