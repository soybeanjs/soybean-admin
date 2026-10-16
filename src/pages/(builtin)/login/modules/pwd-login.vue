<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { SButton, SForm, SInput, SPassword, toast, useForm } from '@vean/ui';
import { useAuthStore } from '@/store/modules/auth';
import { passwordLoginFormSchema, passwordLoginDefaults } from '@/schema/auth';
import type { PasswordLoginFormValues } from '@/schema/auth';
import { useLoginModuleNavigate, useLoginRedirect } from '../use-login';

/** 密码登录（v3 §4.6 / §5.7 P3-05） 详见 docs/v3-notes.md N-295。 */
defineOptions({ name: 'PwdLogin' });

const { t } = useI18n();
const gotoLoginModule = useLoginModuleNavigate();
const authStore = useAuthStore();
const router = useRouter();
const redirectTarget = useLoginRedirect();

async function onSubmit(values: PasswordLoginFormValues): Promise<void> {
  try {
    await authStore.login(values.userName, values.password);
    toast.success(t('login.loginSuccess'));
    await router.replace(redirectTarget.value);
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
      <SButton variant="link" size="sm" class="h-auto px-0" @click="onForgotPassword">
        {{ t('login.forgotPassword') }}
      </SButton>
      <SButton variant="link" size="sm" class="h-auto px-0" @click="onUseCodeLogin">
        {{ t('login.useCodeLogin') }}
      </SButton>
    </div>

    <SButton type="submit" class="w-full" :loading="isSubmitting">{{ t('common.login') }}</SButton>

    <p class="text-center text-sm text-muted-foreground">
      {{ t('login.noAccount') }}
      <SButton variant="link" size="sm" class="h-auto px-0" @click="onRegister">
        {{ t('login.goRegister') }}
      </SButton>
    </p>
  </SForm>
</template>
