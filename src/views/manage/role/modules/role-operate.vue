<script setup lang="ts">
import { computed, onMounted, ref, shallowRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { SButton, SDialog, SForm, SInput, SSelect, STextarea, toast, useForm } from '@vean/ui';
import { fetchAllPermissions } from '@/service/api/permission';
import type { PermissionRow } from '@/service/api/permission';
import { createRole, fetchRoleById, updateRole } from '@/service/api/role';
import { useManageOptions } from '@/composables/use-manage-options';
import { roleFormSchema } from '@/schema/form';
import type { RoleFormDTO } from '@/schema/form';
import { emptyRoleForm, toRoleForm } from '@/schema/form-defaults';
import type { RoleCreateDTO, RoleUpdateDTO } from '@/schema/role';
import PermissionPicker from './permission-picker.vue';

/**
 * 角色新增 / 编辑弹窗（P3-03）。
 *
 * 权限点不用 `SSelect multiple`（上百条会撑爆下拉），改为「已选 N 项」+ 按钮
 * 打开 `PermissionPicker`。当前选中集从 `form.useSelector` 读（`form.state`
 * 是 TanStack Store 快照，没有 Vue 响应性），写回走 `form.setFieldValue`。
 */
defineOptions({ name: 'RoleOperate' });

const props = defineProps<{
  /** 正在编辑的角色 id；`undefined` 表示为新增 */
  roleId?: string;
}>();

const emit = defineEmits<{
  success: [];
}>();

const open = defineModel<boolean>('open', { required: true });

const { t } = useI18n();
const { enabledOptions } = useManageOptions();

const loading = ref(false);
const pickerOpen = ref(false);
const permissions = shallowRef<PermissionRow[]>([]);

const title = computed(() => (props.roleId ? t('manage.editTitle') : t('manage.addTitle')));

const { SFormField, form, handleSubmit, handleReset } = useForm({
  schema: roleFormSchema,
  defaultValues: emptyRoleForm,
  onSubmit: async values => {
    await submit(values);
  }
});

/** 已选权限 id（响应式读取 TanStack Store 的快照） */
const permissionIds = form.useSelector(state => state.values.permissionIds);

const selectedPermissionIds = computed(() => permissionIds.value ?? []);

async function submit(values: RoleFormDTO): Promise<void> {
  loading.value = true;

  try {
    if (props.roleId) {
      const body: RoleUpdateDTO = {
        name: values.name,
        code: values.code,
        description: values.description,
        enabled: values.enabled,
        permissionIds: values.permissionIds
      };

      await updateRole(props.roleId, body);
    } else {
      const body: RoleCreateDTO = {
        name: values.name,
        code: values.code,
        description: values.description,
        permissionIds: values.permissionIds
      };

      await createRole(body);
    }

    open.value = false;

    if (props.roleId) {
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
    const row = await fetchRoleById(id);
    form.reset(toRoleForm(row));
  } finally {
    loading.value = false;
  }
}

function onPickPermissions() {
  pickerOpen.value = true;
}

function onPermissionsConfirmed(ids: string[]) {
  form.setFieldValue('permissionIds', ids);
}

async function loadPermissions(): Promise<void> {
  permissions.value = await fetchAllPermissions();
}

onMounted(() => {
  void loadPermissions();
});

watch(
  [open, () => props.roleId],
  () => {
    if (open.value) {
      void initForm(props.roleId);
    }
  },
  { immediate: true }
);
</script>

<template>
  <SDialog v-model:open="open" :title="title" class="max-w-3xl">
    <SForm class="grid gap-y-6" @submit.prevent="handleSubmit">
      <SFormField name="name" :label="t('manage.role.name')">
        <SInput :placeholder="t('manage.role.name')" />
      </SFormField>

      <SFormField name="code" :label="t('manage.role.code')">
        <SInput :placeholder="t('manage.role.code')" />
      </SFormField>

      <SFormField name="enabled" :label="t('manage.field.enabled')">
        <SSelect :items="enabledOptions" />
      </SFormField>

      <SFormField name="permissionIds" :label="t('manage.role.permissionIds')">
        <div class="flex items-center gap-3">
          <SButton type="button" variant="outline" size="sm" @click="onPickPermissions">
            {{ t('manage.role.pickPermission') }}
          </SButton>
          <span class="text-sm opacity-70">
            {{ t('manage.role.permissionCount', { count: selectedPermissionIds.length }) }}
          </span>
        </div>
      </SFormField>

      <SFormField name="description" :label="t('manage.role.description')">
        <STextarea :placeholder="t('manage.role.description')" />
      </SFormField>
    </SForm>

    <template #footer>
      <SButton variant="outline" @click="open = false">{{ t('common.cancel') }}</SButton>
      <SButton :loading="loading" @click="handleSubmit">{{ t('common.confirm') }}</SButton>
    </template>

    <PermissionPicker
      v-model:open="pickerOpen"
      :selected-ids="selectedPermissionIds"
      :permissions="permissions"
      @confirm="onPermissionsConfirmed"
    />
  </SDialog>
</template>
