<template>
  <div class="pt-24px">
    <n-form ref="formRef" :model="model" :rules="rules" size="large" :show-label="false">
      <n-form-item path="phone">
        <n-input v-model:value="model.phone" placeholder="手机号码" />
      </n-form-item>
      <n-form-item path="code">
        <div class="flex-y-center w-full">
          <n-input v-model:value="model.code" placeholder="验证码" />
          <div class="w-18px"></div>
          <n-button size="large" :disabled="isCounting" @click="handleSmsCode">{{ label }}</n-button>
        </div>
      </n-form-item>
      <n-form-item path="imgCode">
        <n-input v-model:value="model.imgCode" placeholder="验证码,点击图片刷新" />
        <div class="pl-8px">
          <image-verify v-model:code="imgCode" />
        </div>
      </n-form-item>
      <n-space :vertical="true" size="large">
        <login-agreement v-model:value="agreement" />
        <n-button type="primary" size="large" :block="true" :round="true" :loading="loading" @click="handleSubmit">
          确定
        </n-button>
        <n-button size="large" :block="true" :round="true" @click="toCurrentLogin('pwd-login')">返回</n-button>
      </n-space>
    </n-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { NForm, NFormItem, NInput, NSpace, NButton } from 'naive-ui';
import type { FormInst } from 'naive-ui';
import { ImageVerify } from '@/components';
import { useRouterPush, useLogin } from '@/composables';
import { useSmsCode, useAgreement } from '@/hooks';
import { formRules, getImgCodeRule } from '@/utils';
import { LoginAgreement } from '../common';

const { toCurrentLogin } = useRouterPush();
const { loading, login } = useLogin();
const { label, isCounting, getSmsCode } = useSmsCode();
const { agreement, isAgree } = useAgreement();

const formRef = ref<(HTMLElement & FormInst) | null>(null);
const model = reactive({
  phone: '',
  code: '',
  imgCode: ''
});
const imgCode = ref('');
const rules = {
  phone: formRules.phone,
  code: formRules.code,
  imgCode: getImgCodeRule(imgCode)
};

function handleSmsCode() {
  getSmsCode(model.phone);
}

function handleSubmit(e: MouseEvent) {
  if (!formRef.value) return;
  e.preventDefault();

  formRef.value.validate(errors => {
    if (!errors) {
      if (!isAgree()) return;
      const { phone, code } = model;
      login({ phone, pwdOrCode: code, type: 'sms' });
    }
  });
}
</script>
<style scoped></style>
