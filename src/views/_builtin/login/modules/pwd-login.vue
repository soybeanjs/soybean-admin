<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { SButton, SForm, SInput, SPassword, toast, useForm } from '@vean/ui';
import { useAuthStore } from '@/store/modules/auth';
import { getRouter } from '@/router/instance';
import { passwordLoginFormSchema } from '@/schema/auth';
import type { PasswordLoginFormValues } from '@/schema/auth';
import { passwordLoginDefaults } from '@/schema/login-form-defaults';
import { gotoLoginModule, useLoginRedirect } from '../use-login';

/**
 * 密码登录（v3 §4.6 / §5.7 P3-05）。
 *
 * 校验交给 `useForm` + `src/schema/auth.ts` 的 `passwordLoginFormSchema` ——
 * 与服务端 `loginSchema` 的 pwd 分支**同一份 valibot 规则**，前端不再手写
 * 「非空」判断。服务端业务错误（如 `2009` 用户名或密码错误）由请求层统一
 * toast，这里 catch 住不重复提示。成功后回跳 `?redirect=` 指向的来源页，
 * 否则用户 `homePath`。
 */
defineOptions({ name: 'PwdLogin' });

const { t } = useI18n();
const authStore = useAuthStore();
const redirectTarget = useLoginRedirect();

async function onSubmit(values: PasswordLoginFormValues): Promise<void> {
  try {
    await authStore.login(values.userName, values.password);
    toast.success(t('login.loginSuccess'));
    await getRouter().replace(redirectTarget.value);
  } catch {
    // 业务错误已由请求层 toast；静默恢复按钮态
  }
}

const { SFormField, handleSubmit, isSubmitting } = useForm({
  schema: passwordLoginFormSchema,
  defaultValues: passwordLoginDefaults,
  onSubmit
});

function onForgotPassword(): void {
  gotoLoginModule('reset-pwd');
}

function onUseCodeLogin(): void {
  gotoLoginModule('code-login');
}

function onRegister(): void {
  gotoLoginModule('register');
}
</script>

<template>
  <SForm class="gap-4" @submit.prevent="handleSubmit">
    <SFormField name="userName" :label="t('login.userName')">
      <SInput :placeholder="t('login.userNamePlaceholder')" autocomplete="username" />
    </SFormField>
    <SFormField name="password" :label="t('login.password')">
      <SPassword :placeholder="t('login.passwordPlaceholder')" autocomplete="current-password" />
    </SFormField>

    <div class="flex justify-between text-sm">
      <button type="button" class="text-primary hover:underline" @click="onForgotPassword">
        {{ t('login.forgotPassword') }}
      </button>
      <button type="button" class="text-primary hover:underline" @click="onUseCodeLogin">
        {{ t('login.useCodeLogin') }}
      </button>
    </div>

    <SButton type="submit" class="w-full" :loading="isSubmitting">{{ t('common.login') }}</SButton>

    <p class="text-center text-sm text-gray-500">
      {{ t('login.noAccount') }}
      <button type="button" class="text-primary hover:underline" @click="onRegister">
        {{ t('login.goRegister') }}
      </button>
    </p>
  </SForm>
</template>
