<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { SButton, SForm, SInput, toast, useForm } from '@vean/ui';
import { useAuthStore } from '@/store/modules/auth';
import { codeLoginFormSchema, codeLoginDefaults } from '@/schema/auth';
import type { CodeLoginFormValues } from '@/schema/auth';
import { useLoginCaptcha, useLoginModuleNavigate, useLoginRedirect } from '../use-login';

/**
 * 验证码登录（v3 §4.6 / §5.7 P3-05）。
 *
 * v3 无短信通道 —— 短信验证码的凭证角色由**图形验证码**承担（见
 * `src/services/captcha.service.ts`）：用户名 + 图形验证码即完成登录，
 * 服务端按 `grantType: 'captcha'` 分支处理。表单校验走 `codeLoginFormSchema`
 * （服务端 `loginSchema` 的 captcha 分支同一份声明）。
 */
defineOptions({ name: 'CodeLogin' });

const { t } = useI18n();
const gotoLoginModule = useLoginModuleNavigate();
const authStore = useAuthStore();
const router = useRouter();
const redirectTarget = useLoginRedirect();
const { captcha, loading: captchaLoading, refreshCaptcha } = useLoginCaptcha();

const { SFormField, form, handleSubmit, isSubmitting } = useForm({
  schema: codeLoginFormSchema,
  defaultValues: codeLoginDefaults,
  onSubmit
});

async function onSubmit(values: CodeLoginFormValues): Promise<void> {
  try {
    await authStore.loginByCaptcha(values.userName, values.captchaId, values.captchaCode);
    toast.success(t('login.loginSuccess'));
    await router.replace(redirectTarget.value);
  } catch {
    // 验证码一次性消费：失败后必须换新的（否则重放恒报已过期）
    form.setFieldValue('captchaCode', '');
    await refreshCaptcha();
  }
}

/** 验证码标识不在表单里填 —— 由拉取结果回写，保证校验期总有值 */
watch(
  captcha,
  value => {
    form.setFieldValue('captchaId', value?.captchaId ?? '');
  },
  { immediate: true }
);

onMounted(refreshCaptcha);
</script>

<template>
  <SForm class="gap-4" @submit.prevent="handleSubmit">
    <SFormField name="userName" :label="t('login.userName')">
      <SInput :placeholder="t('login.userNamePlaceholder')" autocomplete="username" />
    </SFormField>

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
        @click="refreshCaptcha"
      >
        <img v-if="captcha" :src="captcha.img" :alt="t('login.captchaAlt')" class="h-full w-full object-cover" />
        <span v-else class="text-xs text-muted-foreground">{{ t('common.loading') }}</span>
      </SButton>
    </div>

    <SButton type="submit" class="w-full" :loading="isSubmitting">{{ t('common.login') }}</SButton>

    <p class="text-center text-sm text-muted-foreground">
      <SButton variant="link" size="sm" class="h-auto px-0" @click="gotoLoginModule('pwd-login')">
        {{ t('login.usePwdLogin') }}
      </SButton>
    </p>
  </SForm>
</template>
