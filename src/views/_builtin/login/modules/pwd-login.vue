<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { SButton, SInput, SPassword, toast } from '@vean/ui';
import { useAuthStore } from '@/store/modules/auth';
import { getRouter } from '@/router/instance';
import { gotoLoginModule, useLoginRedirect } from '../use-login';

/**
 * 密码登录（v3 §4.6）。
 *
 * 表单校验只做非空（服务端 valibot 兜底）；业务错误（如 `2009` 用户名或密码
 * 错误）由请求层统一 toast，这里 catch 住不重复提示。成功后回跳
 * `?redirect=` 指向的来源页，否则用户 `homePath`。
 */
defineOptions({ name: 'PwdLogin' });

const { t } = useI18n();
const authStore = useAuthStore();
const redirectTarget = useLoginRedirect();

const userName = ref('admin');
const password = ref('123456');
const submitting = ref(false);

async function handleSubmit(): Promise<void> {
  if (!userName.value.trim() || !password.value) {
    toast.error(t('login.requireFields'));
    return;
  }

  submitting.value = true;

  try {
    await authStore.login(userName.value.trim(), password.value);
    toast.success(t('login.loginSuccess'));
    await getRouter().replace(redirectTarget.value);
  } catch {
    // 业务错误已由请求层 toast；静默恢复按钮态
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
    <SPassword
      v-model="password"
      :label="t('login.password')"
      :placeholder="t('login.passwordPlaceholder')"
      autocomplete="current-password"
    />

    <div class="flex justify-between text-sm">
      <button type="button" class="text-primary hover:underline" @click="gotoLoginModule('reset-pwd')">
        {{ t('login.forgotPassword') }}
      </button>
      <button type="button" class="text-primary hover:underline" @click="gotoLoginModule('code-login')">
        {{ t('login.useCodeLogin') }}
      </button>
    </div>

    <SButton type="submit" class="w-full" :loading="submitting">{{ t('common.login') }}</SButton>

    <p class="text-center text-sm text-gray-500">
      {{ t('login.noAccount') }}
      <button type="button" class="text-primary hover:underline" @click="gotoLoginModule('register')">
        {{ t('login.goRegister') }}
      </button>
    </p>
  </form>
</template>
