<script setup lang="ts">
import { computed, onMounted, ref, shallowRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { SButton, SDialog, SForm, SInput, SSelect, STextarea, toast, useForm } from '@vean/ui';
import { useManageOptions } from '@/composables/use-manage-options';
import { api } from '@/request';
import type { PermissionResource } from '@/schema/permission';
import { roleFormSchema, emptyRoleForm, toRoleForm } from '@/schema/role';
import type { RoleFormDTO, RoleCreateDTO, RoleUpdateDTO } from '@/schema/role';
import PermissionPicker from './permission-picker.vue';

/** 角色新增 / 编辑弹窗（P3-03） 详见 docs/v3-notes.md N-329。 */
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
const permissions = shallowRef<PermissionResource[]>([]);

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

      await api.put('/role/{id}', { pathParams: { id: props.roleId }, body });
    } else {
      const body: RoleCreateDTO = {
        name: values.name,
        code: values.code,
        description: values.description,
        permissionIds: values.permissionIds
      };

      await api.post('/role', { body });
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
    const row = await api.get('/role/{id}', { pathParams: { id } });

    if (row) form.reset(toRoleForm(row));
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
  permissions.value = (await api.get('/permission/all')) ?? [];
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
