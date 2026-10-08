<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { SButton, SDialog, SForm, SInput, SSelect, STextarea, toast, useForm } from '@vean/ui';
import { createOrg, fetchOrgById, updateOrg } from '@/service/api/org-dict';
import type { SelectOption } from '@/composables/use-manage-options';
import { orgFormSchema } from '@/schema/form';
import type { OrgFormDTO } from '@/schema/form';
import { emptyOrgForm, toOrgForm } from '@/schema/form-defaults';
import type { OrgCreateDTO, OrgUpdateDTO } from '@/schema/org-dict';

/**
 * 组织新增 / 编辑弹窗（P3-03）。
 *
 * 父级选择器排除自身，避免自环（后端 `org.service` 也会拦，但前端先挡掉更直观）。
 */
defineOptions({ name: 'OrgOperate' });

const props = defineProps<{
  /** 正在编辑的组织 id；`undefined` 表示为新增 */
  orgId?: string;
  /** 全量组织（父级候选） */
  orgs: SelectOption[];
}>();

const emit = defineEmits<{
  success: [];
}>();

const open = defineModel<boolean>('open', { required: true });

const { t } = useI18n();

const loading = ref(false);

const title = computed(() => (props.orgId ? t('manage.editTitle') : t('manage.addTitle')));

const parentOptions = computed(() => props.orgs.filter(option => option.value !== props.orgId));

const { SFormField, form, handleSubmit, handleReset } = useForm({
  schema: orgFormSchema,
  defaultValues: emptyOrgForm,
  onSubmit: async values => {
    await submit(values);
  }
});

async function submit(values: OrgFormDTO): Promise<void> {
  loading.value = true;

  try {
    if (props.orgId) {
      const body: OrgUpdateDTO = {
        parentId: values.parentId,
        name: values.name,
        code: values.code,
        description: values.description
      };

      await updateOrg(props.orgId, body);
    } else {
      const body: OrgCreateDTO = {
        parentId: values.parentId,
        name: values.name,
        code: values.code,
        description: values.description
      };

      await createOrg(body);
    }

    open.value = false;

    if (props.orgId) {
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
    const row = await fetchOrgById(id);
    form.reset(toOrgForm(row));
  } finally {
    loading.value = false;
  }
}

watch(
  [open, () => props.orgId],
  () => {
    if (open.value) {
      void initForm(props.orgId);
    }
  },
  { immediate: true }
);
</script>

<template>
  <SDialog v-model:open="open" :title="title" class="max-w-3xl">
    <SForm class="grid gap-y-6" @submit.prevent="handleSubmit">
      <SFormField name="parentId" :label="t('manage.field.parentId')">
        <SSelect :items="parentOptions" />
      </SFormField>

      <SFormField name="name" :label="t('manage.org.name')">
        <SInput :placeholder="t('manage.org.name')" />
      </SFormField>

      <SFormField name="code" :label="t('manage.org.code')">
        <SInput :placeholder="t('manage.org.code')" />
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
