<template>
  <div class="pt-24px">
    <n-form ref="formRef" :model="model" :rules="rules" size="large" :show-label="false">
      <n-form-item path="phone">
        <n-input v-model:value="model.phone" placeholder="请输入手机号码" />
      </n-form-item>
      <n-form-item path="pwd">
        <n-input v-model:value="model.pwd" type="password" show-password-on="click" placeholder="请输入密码" />
      </n-form-item>
      <n-form-item path="imgCode">
        <n-input v-model:value="model.imgCode" placeholder="验证码,点击图片刷新" />
        <div class="pl-8px">
          <image-verify v-model:code="imgCode" />
        </div>
      </n-form-item>
      <n-space :vertical="true" size="large">
        <div class="flex-y-center justify-between">
          <n-checkbox v-model:checked="rememberMe">记住我</n-checkbox>
          <span class="text-primary cursor-pointer" @click="toCurrentLogin('reset-pwd')">忘记密码？</span>
        </div>
        <login-agreement v-model:value="agreement" />
        <n-button type="primary" size="large" :block="true" :round="true" :loading="loading" @click="handleSubmit">
          确定
        </n-button>
        <div class="flex-y-center justify-between">
          <n-button class="flex-1" :block="true" @click="toCurrentLogin('code-login')">
            {{ EnumLoginModule['code-login'] }}
          </n-button>
          <div class="w-12px"></div>
          <n-button class="flex-1" :block="true" @click="toCurrentLogin('register')">
            {{ EnumLoginModule.register }}
          </n-button>
        </div>
      </n-space>
    </n-form>
    <other-login />
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { NForm, NFormItem, NInput, NSpace, NCheckbox, NButton } from 'naive-ui';
import type { FormInst, FormRules } from 'naive-ui';
import { EnumLoginModule } from '@/enum';
import { ImageVerify } from '@/components';
import { useRouterPush, useLogin } from '@/composables';
import { useAgreement } from '@/hooks';
import { formRules, getImgCodeRule } from '@/utils';
import { OtherLogin } from './components';
import { LoginAgreement } from '../common';

const { toCurrentLogin } = useRouterPush();
const { loading, login } = useLogin();
const { agreement, isAgree } = useAgreement();

const formRef = ref<(HTMLElement & FormInst) | null>(null);
const model = reactive({
  phone: '15170283876',
  pwd: 'a123456789',
  imgCode: ''
});
const imgCode = ref('');
const rules: FormRules = {
  phone: formRules.phone,
  pwd: formRules.pwd,
  imgCode: getImgCodeRule(imgCode)
};
const rememberMe = ref(false);

function handleSubmit(e: MouseEvent) {
  if (!formRef.value) return;
  e.preventDefault();

  formRef.value.validate(errors => {
    if (!errors) {
      if (!isAgree()) return;
      const { phone, pwd } = model;
      login({ phone, pwdOrCode: pwd, type: 'pwd' });
    }
  });
}
</script>
<style scoped></style>
