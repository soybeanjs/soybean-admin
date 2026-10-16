<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { SButton, SForm, SInput, SPassword, toast, useForm } from '@vean/ui';
import { useAuthStore } from '@/store/modules/auth';
import { registerFormSchema, registerDefaults } from '@/schema/auth';
import type { RegisterFormValues } from '@/schema/auth';
import { useLoginModuleNavigate, useLoginRedirect } from '../use-login';

/** 注册（v3 §4.6 / §5.7 P3-05） 详见 docs/v3-notes.md N-296。 */
defineOptions({ name: 'Register' });

const { t } = useI18n();
const gotoLoginModule = useLoginModuleNavigate();
const authStore = useAuthStore();
const router = useRouter();
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
    await router.replace(redirectTarget.value);
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

    <p class="text-center text-sm text-muted-foreground">
      {{ t('login.hasAccount') }}
      <SButton variant="link" size="sm" class="h-auto px-0" @click="gotoLoginModule('pwd-login')">
        {{ t('login.backLogin') }}
      </SButton>
    </p>
  </SForm>
</template>
