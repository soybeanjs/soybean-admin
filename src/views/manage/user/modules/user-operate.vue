<script setup lang="ts">
import { computed, onMounted, ref, shallowRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { SButton, SDialog, SForm, SInput, SPassword, SSelect, toast, useForm } from '@vean/ui';
import { fetchAllRoles } from '@/service/api/role';
import { createUser, fetchUserById, updateUser } from '@/service/api/user';
import { useManageOptions } from '@/composables/use-manage-options';
import type { SelectOption } from '@/composables/use-manage-options';
import { userFormSchema } from '@/schema/form';
import type { UserFormDTO } from '@/schema/form';
import { emptyUserForm, toUserForm } from '@/schema/form-defaults';
import type { UserCreateDTO, UserUpdateDTO } from '@/schema/user';

/**
 * 用户新增 / 编辑弹窗（P3-03）。
 *
 * 与 `api-operate.vue` 同形，额外两处：
 * - 密码只在新增时必填（`manage.user.createPasswordRequired`），编辑留空表示不改；
 * - 角色用 `SSelect multiple`，选项来自 `GET /api/role/all`。
 *
 * 空串 → `null` 的还原在提交时统一做：表单一律用空串表达"未填"（`SInput`
 * 的 `modelValue` 是 `string`），后端 DTO 的可选字段是 `string | null`。
 */
defineOptions({ name: 'UserOperate' });

const props = defineProps<{
  /** 正在编辑的用户 id；`undefined` 表示为新增 */
  userId?: string;
  /**
   * 正在编辑的用户的角色 id 列表。
   *
   * 由列表页从行数据带过来：`GET /api/user/:id` 不返回角色关联（只有列表行
   * 带 `roles: [{id}]`），若在这里再查列表会多打一次请求且要处理分页。
   */
  roleIds?: string[];
}>();

const emit = defineEmits<{
  success: [];
}>();

const open = defineModel<boolean>('open', { required: true });

const { t } = useI18n();
const { enabledOptions } = useManageOptions();

/** 提交中（详情拉取也计入，避免"回填未完成就能提交空表"） */
const loading = ref(false);

const roleOptions = shallowRef<SelectOption[]>([]);

const title = computed(() => (props.userId ? t('manage.editTitle') : t('manage.addTitle')));

const { SFormField, form, handleSubmit, handleReset } = useForm({
  schema: userFormSchema,
  defaultValues: emptyUserForm,
  onSubmit: async values => {
    await submit(values);
  }
});

/** 空串 → `null`（后端可选字段契约） */
function nullable(value: string): string | null {
  return value === '' ? null : value;
}

async function submit(values: UserFormDTO): Promise<void> {
  if (!props.userId && !values.password) {
    toast.error(t('manage.user.createPasswordRequired'));
    return;
  }

  loading.value = true;

  try {
    if (props.userId) {
      const body: UserUpdateDTO = {
        phone: nullable(values.phone),
        email: nullable(values.email),
        fullName: nullable(values.fullName),
        homePath: nullable(values.homePath),
        enabled: values.enabled,
        roleIds: values.roleIds
      };

      if (values.password) {
        body.password = values.password;
      }

      await updateUser(props.userId, body);
    } else {
      const body: UserCreateDTO = {
        username: values.username,
        password: values.password,
        phone: nullable(values.phone),
        email: nullable(values.email),
        fullName: nullable(values.fullName),
        avatar: null,
        homePath: values.homePath || '/home',
        roleIds: values.roleIds
      };

      await createUser(body);
    }

    open.value = false;

    if (props.userId) {
      toast.success(t('manage.updateSuccess'));
    } else {
      toast.success(t('manage.createSuccess'));
    }

    emit('success');
  } finally {
    loading.value = false;
  }
}

/** 新增：重置为表单初值；编辑：拉详情后回填（角色取列表页带过来的行数据） */
async function initForm(id: string | undefined): Promise<void> {
  if (!id) {
    handleReset();
    return;
  }

  loading.value = true;

  try {
    const row = await fetchUserById(id);
    form.reset({ ...toUserForm(row), roleIds: props.roleIds ?? [] });
  } finally {
    loading.value = false;
  }
}

async function loadRoleOptions(): Promise<void> {
  const roles = await fetchAllRoles();

  roleOptions.value = roles.map(role => ({
    value: role.id,
    label: `${role.name} (${role.code})`
  }));
}

onMounted(() => {
  void loadRoleOptions();
});

watch(
  [open, () => props.userId],
  () => {
    if (open.value) {
      void initForm(props.userId);
    }
  },
  { immediate: true }
);
</script>

<template>
  <SDialog v-model:open="open" :title="title" class="max-w-3xl">
    <SForm class="grid gap-y-6" @submit.prevent="handleSubmit">
      <SFormField name="username" :label="t('manage.user.username')">
        <SInput :placeholder="t('manage.user.username')" :disabled="Boolean(props.userId)" />
      </SFormField>

      <SFormField name="password" :label="t('manage.user.password')">
        <SPassword
          :placeholder="props.userId ? t('manage.user.passwordOptional') : t('manage.user.passwordPlaceholder')"
        />
      </SFormField>

      <SFormField name="fullName" :label="t('manage.user.fullName')">
        <SInput :placeholder="t('manage.user.fullName')" />
      </SFormField>

      <SFormField name="phone" :label="t('manage.user.phone')">
        <SInput :placeholder="t('manage.user.phone')" />
      </SFormField>

      <SFormField name="email" :label="t('manage.user.email')">
        <SInput :placeholder="t('manage.user.email')" />
      </SFormField>

      <SFormField name="homePath" :label="t('manage.user.homePath')">
        <SInput :placeholder="t('manage.user.homePath')" />
      </SFormField>

      <SFormField name="roleIds" :label="t('manage.user.roleIds')">
        <SSelect multiple :items="roleOptions" />
      </SFormField>

      <SFormField name="enabled" :label="t('manage.field.enabled')">
        <SSelect :items="enabledOptions" />
      </SFormField>
    </SForm>

    <template #footer>
      <SButton variant="outline" @click="open = false">{{ t('common.cancel') }}</SButton>
      <SButton :loading="loading" @click="handleSubmit">{{ t('common.confirm') }}</SButton>
    </template>
  </SDialog>
</template>
