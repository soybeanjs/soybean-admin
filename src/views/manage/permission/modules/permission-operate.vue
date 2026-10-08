<script setup lang="ts">
import { computed, onMounted, ref, shallowRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { SButton, SDialog, SForm, SInput, SSelect, STextarea, toast, useForm } from '@vean/ui';
import { fetchAllApis } from '@/service/api/api';
import { fetchAllMenus } from '@/service/api/menu-manage';
import { createPermission, fetchPermissionById, updatePermission } from '@/service/api/permission';
import type { SelectOption } from '@/composables/use-manage-options';
import { permissionFormSchema } from '@/schema/form';
import type { PermissionFormDTO } from '@/schema/form';
import { emptyPermissionForm, toPermissionForm } from '@/schema/form-defaults';
import type { PermissionCreateDTO, PermissionUpdateDTO } from '@/schema/permission';

/**
 * 权限点新增 / 编辑弹窗（P3-03）。
 *
 * 资源绑定：`resourceType` 为 `menu` / `api` 时必须选 `resourceId`，后端会据此
 * 推导 `name` / `code`（见 `src/services/permission.service.ts` 的
 * `resolveResourceBinding`）；`other` 则手工填 `name` / `code`。
 *
 * 刻意不提供 `button` 选项：schema 与种子数据里有这个取值，但
 * `resolveResourceBinding` 只认 `other` / `api` / `menu`，选了会被后端拒绝。
 * 搜索卡仍保留 `button`，以便过滤历史数据。
 */
defineOptions({ name: 'PermissionOperate' });

const props = defineProps<{
  /** 正在编辑的权限 id；`undefined` 表示为新增 */
  permissionId?: string;
}>();

const emit = defineEmits<{
  success: [];
}>();

const open = defineModel<boolean>('open', { required: true });

const { t } = useI18n();

const loading = ref(false);
const menus = shallowRef<SelectOption[]>([]);
const apis = shallowRef<SelectOption[]>([]);

const title = computed(() => (props.permissionId ? t('manage.editTitle') : t('manage.addTitle')));

/** 资源类型下拉：只列后端支持绑定的类型 */
const resourceTypeOptions = computed<SelectOption[]>(() => [
  { value: 'menu', label: t('manage.resourceType.menu') },
  { value: 'api', label: t('manage.resourceType.api') },
  { value: 'other', label: t('manage.resourceType.other') }
]);

const { SFormField, form, handleSubmit, handleReset } = useForm({
  schema: permissionFormSchema,
  defaultValues: emptyPermissionForm,
  onSubmit: async values => {
    await submit(values);
  }
});

const resourceType = form.useSelector(state => state.values.resourceType);

const isMenuBinding = computed(() => resourceType.value === 'menu');
const isApiBinding = computed(() => resourceType.value === 'api');
const isBound = computed(() => isMenuBinding.value || isApiBinding.value);

const resourceOptions = computed(() => (isMenuBinding.value ? menus.value : apis.value));

async function submit(values: PermissionFormDTO): Promise<void> {
  loading.value = true;

  try {
    if (props.permissionId) {
      const body: PermissionUpdateDTO = {
        name: values.name,
        code: values.code,
        resourceType: values.resourceType,
        resourceId: values.resourceId,
        description: values.description
      };

      await updatePermission(props.permissionId, body);
    } else {
      const body: PermissionCreateDTO = {
        name: values.name,
        code: values.code,
        resourceType: values.resourceType,
        resourceId: values.resourceId,
        description: values.description
      };

      await createPermission(body);
    }

    open.value = false;

    if (props.permissionId) {
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
    const row = await fetchPermissionById(id);
    form.reset(toPermissionForm(row));
  } finally {
    loading.value = false;
  }
}

async function loadResources(): Promise<void> {
  const [menuRows, apiRows] = await Promise.all([fetchAllMenus(), fetchAllApis()]);

  menus.value = menuRows.map(row => ({ value: row.id, label: row.name }));
  apis.value = apiRows.map(row => ({ value: row.id, label: `${row.method.toUpperCase()} ${row.path}` }));
}

/** 切换资源类型时清掉上一个绑定 */
function onResourceTypeChange() {
  form.setFieldValue('resourceId', null);
}

onMounted(() => {
  void loadResources();
});

watch(resourceType, onResourceTypeChange);

watch(
  [open, () => props.permissionId],
  () => {
    if (open.value) {
      void initForm(props.permissionId);
    }
  },
  { immediate: true }
);
</script>

<template>
  <SDialog v-model:open="open" :title="title" class="max-w-3xl">
    <SForm class="grid gap-y-6" @submit.prevent="handleSubmit">
      <SFormField name="resourceType" :label="t('manage.permission.resourceType')">
        <SSelect :items="resourceTypeOptions" />
      </SFormField>

      <SFormField v-if="isBound" name="resourceId" :label="t('manage.permission.resourceId')">
        <SSelect :items="resourceOptions" />
      </SFormField>

      <SFormField v-if="!isBound" name="name" :label="t('manage.permission.name')">
        <SInput :placeholder="t('manage.permission.name')" />
      </SFormField>

      <SFormField v-if="!isBound" name="code" :label="t('manage.permission.code')">
        <SInput :placeholder="t('manage.permission.code')" />
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
