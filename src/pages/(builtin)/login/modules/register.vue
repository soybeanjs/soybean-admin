<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { SButton, SForm, SInput, SPassword, toast, useForm } from '@vean/ui';
import { useAuthStore } from '@/store/modules/auth';
import { getRouter } from '@/router/instance';
import { registerFormSchema } from '@/schema/auth';
import type { RegisterFormValues } from '@/schema/auth';
import { registerDefaults } from '@/schema/login-form-defaults';
import { gotoLoginModule, useLoginRedirect } from '../use-login';

/**
 * 注册（v3 §4.6 / §5.7 P3-05）。
 *
 * 后端 `/api/auth/register` 是「注册即登录」：直接返回 token 对，因此注册
 * 成功后无需再走一次登录，落库后按 `?redirect=` / `homePath` 回跳。
 *
 * 校验走 `registerFormSchema` —— 服务端 `registerSchema` 的超集：用户名长度、
 * 密码长度、邮箱格式两边同一份声明，多出的只有「两次密码一致」。`email` 在
 * 表单里是普通字符串（空串 = 未填），提交前 `|| undefined` 归一。
 */
defineOptions({ name: 'Register' });

const { t } = useI18n();
const authStore = useAuthStore();
const redirectTarget = useLoginRedirect();

const { SFormField, handleSubmit, isSubmitting } = useForm({
  schema: registerFormSchema,
  defaultValues: registerDefaults,
  onSubmit
});

async function onSubmit(values: RegisterFormValues): Promise<void> {
  try {
    await authStore.register({
      userName: values.userName,
      password: values.password,
      email: values.email || undefined,
      fullName: values.fullName || undefined
    });
    toast.success(t('login.registerSuccess'));
    await getRouter().replace(redirectTarget.value);
  } catch {
    // 业务错误（如 2011 用户名已存在）已由请求层 toast
  }
}
</script>

<template>
  <SForm class="gap-4" @submit.prevent="handleSubmit">
    <SFormField name="userName" :label="t('login.userName')">
      <SInput :placeholder="t('login.userNamePlaceholder')" autocomplete="username" />
    </SFormField>
    <SFormField name="email" :label="t('login.email')">
      <SInput :placeholder="t('login.emailPlaceholder')" autocomplete="email" type="email" />
    </SFormField>
    <SFormField name="password" :label="t('login.password')">
      <SPassword :placeholder="t('login.passwordPlaceholder')" autocomplete="new-password" />
    </SFormField>
    <SFormField name="confirmPassword" :label="t('login.confirmPassword')">
      <SPassword :placeholder="t('login.confirmPasswordPlaceholder')" autocomplete="new-password" />
    </SFormField>

    <SButton type="submit" class="w-full" :loading="isSubmitting">{{ t('login.register') }}</SButton>

    <p class="text-center text-sm text-gray-500">
      {{ t('login.hasAccount') }}
      <button type="button" class="text-primary hover:underline" @click="gotoLoginModule('pwd-login')">
        {{ t('login.backLogin') }}
      </button>
    </p>
  </SForm>
</template>
