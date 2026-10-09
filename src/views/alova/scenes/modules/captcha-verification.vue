<script setup lang="ts">
import { computed } from 'vue';
import { actionDelegationMiddleware, useCaptcha, useForm } from '@sa/alova/client';
import { $t } from '@/locales';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { sendCaptcha, verifyCaptcha } from '@/service-alova/api';

defineOptions({
  name: 'CaptchaVerification'
});

const { loading, send, countdown } = useCaptcha(sendCaptcha, {
  middleware: actionDelegationMiddleware('captcha:send')
});
const label = computed(() => {
  return countdown.value > 0
    ? $t('page.login.codeLogin.reGetCode', { time: countdown.value })
    : $t('page.login.codeLogin.getCode');
});
const {
  form,
  loading: submiting,
  send: submit
} = useForm(formData => verifyCaptcha(formData.phone, formData.code), {
  initialForm: {
    phone: '',
    code: ''
  }
});

const { formRef, validate } = useNaiveForm();

const rules = computed<Record<keyof typeof form.value, App.Global.FormRule[]>>(() => {
  const { formRules } = useFormRules();

  return {
    phone: formRules.phone,
    code: formRules.code
  };
});

async function handleSubmit() {
  await validate();
  await submit();
  // request
  window.$message?.success($t('page.login.common.validateSuccess'));
}
</script>

<template>
  <NForm ref="formRef" :model="form" :rules="rules" size="large" :show-label="false" @keyup.enter="handleSubmit">
    <NFormItem path="phone">
      <NInput v-model:value="form.phone" :placeholder="$t('page.login.common.phonePlaceholder')" :maxlength="11" />
    </NFormItem>
    <NFormItem path="code">
      <div class="w-full flex-y-center gap-16px">
        <NInput v-model:value="form.code" :placeholder="$t('page.login.common.codePlaceholder')" />
        <NButton size="large" :disabled="countdown > 0" :loading="loading" @click="send(form.phone)">
          {{ label }}
        </NButton>
      </div>
    </NFormItem>
    <NSpace vertical :size="18" class="w-full">
      <NButton type="primary" size="large" round block :loading="submiting" @click="handleSubmit">
        {{ $t('common.confirm') }}
      </NButton>
    </NSpace>
  </NForm>
</template>

<style scoped></style>
