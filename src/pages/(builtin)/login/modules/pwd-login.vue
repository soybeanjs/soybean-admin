<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { BACKEND_ERROR_FLAG } from '@soybeanjs/fetch';
import { SButton, SForm, SInput, SPassword, toast, useForm } from '@vean/ui';
import { useAuthStore } from '@/store/modules/auth';
import { passwordLoginFormSchema, passwordLoginDefaults } from '@/schema/auth';
import type { PasswordLoginFormValues } from '@/schema/auth';
import { useLoginCaptcha, useLoginModuleNavigate, useLoginRedirect } from '../use-login';

/** 密码登录（v3 §4.6 / §5.7 P3-05） 详见 docs/v3-notes.md N-295。 */
defineOptions({ name: 'PwdLogin' });

/** 服务端要求图形验证码的业务码（`src/constants/error-code.ts` 的 LOGIN_ATTEMPTS_EXCEEDED） */
const LOGIN_ATTEMPTS_EXCEEDED = '4102';

const { t } = useI18n();
const gotoLoginModule = useLoginModuleNavigate();
const authStore = useAuthStore();
const router = useRouter();
const redirectTarget = useLoginRedirect();
const { captcha, loading: captchaLoading, refreshCaptcha } = useLoginCaptcha();

/**
 * 验证码升级（审计 1.6）：连续失败 5 次后服务端拒绝无验证码的登录并返回 `4102`。
 *
 * 门槛与计数全在 `src/services/login-guard.service.ts` —— 前端不自行计数，否则刷新
 * 页面就把计数清零了。这里只做「收到 4102 → 展开验证码行 → 重新拉一张」。
 */
const captchaRequired = ref(false);

/** 对象守卫（在 unknown 上取字段而不做 `as` 断言） */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/** 从抛出的 `BackendError` 里读业务码（非业务失败返回空串） */
function readBackendCode(error: unknown): string {
  if (!isRecord(error) || error.code !== BACKEND_ERROR_FLAG) return '';

  const { response } = error;
  if (!isRecord(response) || !isRecord(response.data)) return '';

  const { code } = response.data;

  return typeof code === 'string' ? code : '';
}

const { form, handleSubmit, isSubmitting } = useForm({
  schema: passwordLoginFormSchema,
  defaultValues: passwordLoginDefaults,
  onSubmit
});

async function onSubmit(values: PasswordLoginFormValues): Promise<void> {
  try {
    await authStore.login(values.userName, values.password, {
      captchaId: values.captchaId,
      captchaCode: values.captchaCode
    });
    toast.success(t('login.loginSuccess'));
    await router.replace(redirectTarget.value);
  } catch (error) {
    if (readBackendCode(error) === LOGIN_ATTEMPTS_EXCEEDED) {
      // 服务端已进入「必须验证码」状态：展开验证码行并拉一张新的
      captchaRequired.value = true;
      form.setFieldValue('captchaCode', '');
      await refreshCaptcha();
      return;
    }
    // 其余业务错误已由请求层 toast；静默恢复按钮态
  }
}

/** 验证码一换，表单里的 `captchaId` 跟着换 —— 否则提交的是上一张，服务端必然判失效 */
watch(
  captcha,
  value => {
    form.setFieldValue('captchaId', value?.captchaId ?? '');
  },
  { immediate: true }
);

/** 已进入验证码状态却没拉到图时补一次 */
onMounted(() => {
  if (captchaRequired.value && !captcha.value) void refreshCaptcha();
});

function onRefreshCaptcha(): void {
  void refreshCaptcha();
}

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

    <template v-if="captchaRequired">
      <div class="flex items-end gap-2">
        <SFormField name="captchaCode" :label="t('login.captcha')" class="flex-1">
          <SInput :placeholder="t('login.captchaPlaceholder')" autocomplete="off" :maxlength="6" />
        </SFormField>
        <SButton
          variant="plain"
          size="sm"
          class="h-9 w-28 shrink-0 overflow-hidden p-0"
          :title="t('login.refreshCaptcha')"
          :disabled="captchaLoading"
          @click="onRefreshCaptcha"
        >
          <img v-if="captcha" :src="captcha.img" :alt="t('login.captchaAlt')" class="h-full w-full object-cover" />
          <span v-else class="text-xs text-muted-foreground">{{ t('common.loading') }}</span>
        </SButton>
      </div>
      <p class="text-sm text-muted-foreground">{{ t('login.captchaRequiredTip') }}</p>
    </template>

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
