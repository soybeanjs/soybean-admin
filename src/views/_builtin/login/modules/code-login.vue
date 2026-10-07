<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { SButton, SInput, toast } from '@vean/ui';
import { useAuthStore } from '@/store/modules/auth';
import { getRouter } from '@/router/instance';
import { gotoLoginModule, useLoginCaptcha, useLoginRedirect } from '../use-login';

/**
 * 验证码登录（v3 §4.6）。
 *
 * v3 无短信通道 —— 短信验证码的凭证角色由**图形验证码**承担（见
 * `src/services/captcha.service.ts`）：用户名 + 图形验证码即完成登录，
 * 服务端按 `grantType: 'captcha'` 分支处理。
 */
defineOptions({ name: 'CodeLogin' });

const { t } = useI18n();
const authStore = useAuthStore();
const redirectTarget = useLoginRedirect();
const { captcha, loading: captchaLoading, refreshCaptcha } = useLoginCaptcha();

const userName = ref('admin');
const captchaCode = ref('');
const submitting = ref(false);

onMounted(refreshCaptcha);

async function handleSubmit(): Promise<void> {
  if (!userName.value.trim() || !captchaCode.value.trim() || !captcha.value) {
    toast.error(t('login.requireFields'));
    return;
  }

  submitting.value = true;

  try {
    await authStore.loginByCaptcha(userName.value.trim(), captcha.value.captchaId, captchaCode.value.trim());
    toast.success(t('login.loginSuccess'));
    await getRouter().replace(redirectTarget.value);
  } catch {
    // 验证码一次性消费：失败后必须换新的（否则重放恒报已过期）
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

    <SButton type="submit" class="w-full" :loading="submitting">{{ t('common.login') }}</SButton>

    <p class="text-center text-sm text-gray-500">
      <button type="button" class="text-primary hover:underline" @click="gotoLoginModule('pwd-login')">
        {{ t('login.usePwdLogin') }}
      </button>
    </p>
  </form>
</template>
