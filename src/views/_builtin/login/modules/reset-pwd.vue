<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { SButton, SInput, SPassword, toast } from '@vean/ui';
import { fetchResetPassword } from '@/service/api/auth';
import { gotoLoginModule, useLoginCaptcha } from '../use-login';

/**
 * 重置密码（v3 §4.6）。
 *
 * 未登录态页面，凭证用图形验证码（无短信通道，与 v2 `reset-pwd` 语义一致）。
 * 成功后**不**自动登录，回到密码登录模块让用户用新密码登录。
 */
defineOptions({ name: 'ResetPwd' });

const { t } = useI18n();
const { captcha, loading: captchaLoading, refreshCaptcha } = useLoginCaptcha();

const userName = ref('');
const password = ref('');
const confirmPassword = ref('');
const captchaCode = ref('');
const submitting = ref(false);

onMounted(refreshCaptcha);

async function handleSubmit(): Promise<void> {
  if (!userName.value.trim() || !password.value || !captchaCode.value.trim() || !captcha.value) {
    toast.error(t('login.requireFields'));
    return;
  }

  if (password.value !== confirmPassword.value) {
    toast.error(t('login.passwordMismatch'));
    return;
  }

  submitting.value = true;

  try {
    await fetchResetPassword({
      userName: userName.value.trim(),
      password: password.value,
      captchaId: captcha.value.captchaId,
      captchaCode: captchaCode.value.trim()
    });
    toast.success(t('login.resetSuccess'));
    gotoLoginModule('pwd-login');
  } catch {
    captchaCode.value = '';
    await refreshCaptcha();
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
      autocomplete="new-password"
    />
    <SPassword
      v-model="confirmPassword"
      :label="t('login.confirmPassword')"
      :placeholder="t('login.confirmPasswordPlaceholder')"
      autocomplete="new-password"
    />

    <div class="flex items-end gap-2">
      <SInput
        v-model="captchaCode"
        class="flex-1"
        :label="t('login.captcha')"
        :placeholder="t('login.captchaPlaceholder')"
        autocomplete="off"
        :maxlength="6"
      />
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

    <SButton type="submit" class="w-full" :loading="submitting">{{ t('login.resetPwd') }}</SButton>

    <p class="text-center text-sm text-gray-500">
      <button type="button" class="text-primary hover:underline" @click="gotoLoginModule('pwd-login')">
        {{ t('login.backLogin') }}
      </button>
    </p>
  </form>
</template>
