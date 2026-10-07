<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { SButton, SInput, SPassword, toast } from '@vean/ui';
import { useAuthStore } from '@/store/modules/auth';
import { getRouter } from '@/router/instance';
import { gotoLoginModule, useLoginRedirect } from '../use-login';

/**
 * 注册（v3 §4.6）。
 *
 * 后端 `/api/auth/register` 是「注册即登录」：直接返回 token 对，因此注册
 * 成功后无需再走一次登录，落库后按 `?redirect=` / `homePath` 回跳。
 * `email` 可选（后端落库，不参与校验）。
 */
defineOptions({ name: 'Register' });

const { t } = useI18n();
const authStore = useAuthStore();
const redirectTarget = useLoginRedirect();

const userName = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const submitting = ref(false);

async function handleSubmit(): Promise<void> {
  if (!userName.value.trim() || !password.value) {
    toast.error(t('login.requireFields'));
    return;
  }

  if (password.value !== confirmPassword.value) {
    toast.error(t('login.passwordMismatch'));
    return;
  }

  submitting.value = true;

  try {
    await authStore.register({
      userName: userName.value.trim(),
      password: password.value,
      email: email.value.trim() || undefined
    });
    toast.success(t('login.registerSuccess'));
    await getRouter().replace(redirectTarget.value);
  } catch {
    // 业务错误（如 2011 用户名已存在）已由请求层 toast
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
    <SInput
      v-model="userName"
      :label="t('login.userName')"
      :placeholder="t('login.userNamePlaceholder')"
      autocomplete="username"
    />
    <SInput
      v-model="email"
      :label="t('login.email')"
      :placeholder="t('login.emailPlaceholder')"
      autocomplete="email"
      type="email"
    />
    <SPassword
      v-model="password"
      :label="t('login.password')"
      :placeholder="t('login.passwordPlaceholder')"
      autocomplete="new-password"
    />
    <SPassword
      v-model="confirmPassword"
      :label="t('login.confirmPassword')"
      :placeholder="t('login.confirmPasswordPlaceholder')"
      autocomplete="new-password"
    />

    <SButton type="submit" class="w-full" :loading="submitting">{{ t('login.register') }}</SButton>

    <p class="text-center text-sm text-gray-500">
      {{ t('login.hasAccount') }}
      <button type="button" class="text-primary hover:underline" @click="gotoLoginModule('pwd-login')">
        {{ t('login.backLogin') }}
      </button>
    </p>
  </form>
</template>
