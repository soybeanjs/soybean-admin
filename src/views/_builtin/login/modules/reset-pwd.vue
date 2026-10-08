<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { SButton, SForm, SInput, SPassword, toast, useForm } from '@vean/ui';
import { fetchResetPassword } from '@/service/api/auth';
import { resetPasswordFormSchema } from '@/schema/auth';
import type { ResetPasswordFormValues } from '@/schema/auth';
import { resetPasswordDefaults } from '@/schema/login-form-defaults';
import { gotoLoginModule, useLoginCaptcha } from '../use-login';

/**
 * 重置密码（v3 §4.6 / §5.7 P3-05）。
 *
 * 未登录态页面，凭证用图形验证码（无短信通道，与 v2 `reset-pwd` 语义一致）。
 * 成功后**不**自动登录，回到密码登录模块让用户用新密码登录。
 *
 * 校验走 `resetPasswordFormSchema`（服务端 `resetPasswordSchema` + 确认密码）。
 * `captchaId` 不在表单里填，由拉取结果回写（见下方 `watch`）。
 */
defineOptions({ name: 'ResetPwd' });

const { t } = useI18n();
const { captcha, loading: captchaLoading, refreshCaptcha } = useLoginCaptcha();

const { SFormField, form, handleSubmit, isSubmitting } = useForm({
  schema: resetPasswordFormSchema,
  defaultValues: resetPasswordDefaults,
  onSubmit
});

/** 验证码标识来自拉取结果，不是用户输入 —— 回写保证提交/校验期总有值 */
watch(
  captcha,
  value => {
    form.setFieldValue('captchaId', value?.captchaId ?? '');
  },
  { immediate: true }
);

async function onSubmit(values: ResetPasswordFormValues): Promise<void> {
  try {
    await fetchResetPassword({
      userName: values.userName,
      password: values.password,
      captchaId: values.captchaId,
      captchaCode: values.captchaCode
    });
    toast.success(t('login.resetSuccess'));
    gotoLoginModule('pwd-login');
  } catch {
    form.setFieldValue('captchaCode', '');
    await refreshCaptcha();
  }
}

onMounted(refreshCaptcha);
</script>

<template>
  <SForm class="gap-4" @submit.prevent="handleSubmit">
    <SFormField name="userName" :label="t('login.userName')">
      <SInput :placeholder="t('login.userNamePlaceholder')" autocomplete="username" />
    </SFormField>
    <SFormField name="password" :label="t('login.password')">
      <SPassword :placeholder="t('login.passwordPlaceholder')" autocomplete="new-password" />
    </SFormField>
    <SFormField name="confirmPassword" :label="t('login.confirmPassword')">
      <SPassword :placeholder="t('login.confirmPasswordPlaceholder')" autocomplete="new-password" />
    </SFormField>

    <div class="flex items-end gap-2">
      <SFormField name="captchaCode" :label="t('login.captcha')" class="flex-1">
        <SInput :placeholder="t('login.captchaPlaceholder')" autocomplete="off" :maxlength="6" />
      </SFormField>
      <button
        type="button"
        class="h-9 w-28 flex-center overflow-hidden rounded border border-gray-200 dark:border-gray-700"
        :title="t('login.refreshCaptcha')"
        :disabled="captchaLoading"
        @click="refreshCaptcha"
      >
        <img v-if="captcha" :src="captcha.img" :alt="t('login.captchaAlt')" class="h-full w-full object-cover" />
        <span v-else class="text-xs text-gray-400">{{ t('common.loading') }}</span>
      </button>
    </div>

    <SButton type="submit" class="w-full" :loading="isSubmitting">{{ t('login.resetPwd') }}</SButton>

    <p class="text-center text-sm text-gray-500">
      <button type="button" class="text-primary hover:underline" @click="gotoLoginModule('pwd-login')">
        {{ t('login.backLogin') }}
      </button>
    </p>
  </SForm>
</template>
