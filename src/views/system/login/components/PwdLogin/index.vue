<template>
  <div class="pt-24px">
    <n-form ref="formRef" :model="model" :rules="rules" size="large" :show-label="false">
      <n-form-item path="phone">
        <n-input v-model:value="model.phone" placeholder="手机号码" />
      </n-form-item>
      <n-form-item path="pwd">
        <n-input v-model:value="model.pwd" placeholder="密码" />
      </n-form-item>
      <n-space :vertical="true" size="large">
        <div class="flex-y-center justify-between">
          <n-checkbox v-model:checked="rememberMe">记住我</n-checkbox>
          <span class="g_text-primary cursor-pointer" @click="toCurrentLogin('reset-pwd')">忘记密码？</span>
        </div>
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
import { NForm, NFormItem, NInput, NSpace, NCheckbox, NButton, useNotification } from 'naive-ui';
import type { FormInst, FormRules } from 'naive-ui';
import { EnumLoginModule } from '@/enum';
import { useRouterChange, useRouteQuery, useLoading } from '@/hooks';
import { setToken } from '@/utils';
import { OtherLogin } from './components';

const { toHome, toCurrentLogin, toLoginRedirectUrl } = useRouterChange();
const { loginRedirectUrl } = useRouteQuery();
const { loading, startLoading, endLoading } = useLoading();
const notification = useNotification();

const formRef = ref<(HTMLElement & FormInst) | null>(null);
const model = reactive({
  phone: '15100000000',
  pwd: '123456'
});
const rules: FormRules = {
  phone: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入手机号'
  },
  pwd: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入密码'
  }
};
const rememberMe = ref(false);

function handleSubmit(e: MouseEvent) {
  if (!formRef.value) return;
  e.preventDefault();

  formRef.value.validate(errors => {
    if (!errors) {
      startLoading();
      setTimeout(() => {
        endLoading();
        setToken('temp-token');
        if (loginRedirectUrl.value) {
          toLoginRedirectUrl(loginRedirectUrl.value);
        } else {
          toHome();
        }
        notification.success({
          title: '登录成功！',
          content: '欢迎回来，Soybean!',
          duration: 3000
        });
      }, 1000);
    }
  });
}
</script>
<style scoped></style>
