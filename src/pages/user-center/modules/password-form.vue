<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { SButton, SCard, SForm, SPassword, toast, useForm } from '@vean/ui';
import { fetchModifyPassword } from '@/service/api/auth';
import { EMPTY_PASSWORD_FORM, changePasswordFormSchema } from '@/schema/profile';
import type { ChangePasswordFormValues } from '@/schema/profile';

/**
 * 修改密码卡（个人中心）。
 *
 * `changePasswordFormSchema` 用 `v.forward(v.partialCheck(...))` 做「两次输入一致」
 * 的跨字段校验 —— 与登录页注册表单同一写法；错误键落在 `confirmPassword` 上，
 * 所以模板里只需渲染三个字段，不需要额外的手写比较。
 *
 * 成功后不强制登出（后端旧 token 仍有效），只清空表单提示用户。
 */

defineOptions({ name: 'UserCenterPasswordForm' });

const { t } = useI18n();

const loading = ref(false);

const { SFormField, handleSubmit, handleReset } = useForm({
  schema: changePasswordFormSchema,
  defaultValues: EMPTY_PASSWORD_FORM,
  onSubmit: async values => {
    await save(values);
  }
});

async function save(values: ChangePasswordFormValues): Promise<void> {
  loading.value = true;

  try {
    await fetchModifyPassword({ currentPassword: values.currentPassword, newPassword: values.newPassword });
    handleReset();
    toast.success(t('userCenter.password.saveSuccess'));
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <SCard :title="t('userCenter.password.title')">
    <p class="mb-4 text-sm opacity-60">{{ t('userCenter.password.tip') }}</p>

    <SForm class="grid gap-y-6" @submit.prevent="handleSubmit">
      <SFormField name="currentPassword" :label="t('userCenter.password.current')">
        <SPassword :placeholder="t('userCenter.password.currentPlaceholder')" />
      </SFormField>

      <SFormField name="newPassword" :label="t('userCenter.password.new')">
        <SPassword :placeholder="t('userCenter.password.newPlaceholder')" />
      </SFormField>

      <SFormField name="confirmPassword" :label="t('userCenter.password.confirm')">
        <SPassword :placeholder="t('userCenter.password.confirmPlaceholder')" />
      </SFormField>

      <div class="flex justify-end">
        <SButton type="button" :loading="loading" @click="handleSubmit">{{ t('common.confirm') }}</SButton>
      </div>
    </SForm>
  </SCard>
</template>
