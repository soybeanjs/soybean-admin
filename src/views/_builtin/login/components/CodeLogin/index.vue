<template>
  <n-form ref="formRef" :model="model" :rules="rules" size="large" :show-label="false">
    <n-form-item path="phone">
      <n-input v-model:value="model.phone" placeholder="手机号码" />
    </n-form-item>
    <n-form-item path="code">
      <div class="flex-y-center w-full">
        <n-input v-model:value="model.code" placeholder="验证码" />
        <div class="w-18px"></div>
        <n-button size="large" :disabled="isCounting" :loading="smsLoading" @click="handleSmsCode">
          {{ label }}
        </n-button>
      </div>
    </n-form-item>
    <n-form-item path="imgCode">
      <n-input v-model:value="model.imgCode" placeholder="验证码,点击图片刷新" />
      <div class="pl-8px">
        <image-verify v-model:code="imgCode" />
      </div>
    </n-form-item>
    <n-space :vertical="true" :size="18">
      <n-button
        type="primary"
        size="large"
        :block="true"
        :round="true"
        :loading="auth.loginLoading"
        @click="handleSubmit"
      >
        确定
      </n-button>
      <n-button size="large" :block="true" :round="true" @click="toLoginModule('pwd-login')">返回</n-button>
    </n-space>
  </n-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { FormInst } from 'naive-ui';
import { useAuthStore } from '@/store';
import { useRouterPush } from '@/composables';
import { useSmsCode } from '@/hooks';
import { formRules, getImgCodeRule } from '@/utils';

const auth = useAuthStore();
const { toLoginModule } = useRouterPush();
const { label, isCounting, loading: smsLoading, getSmsCode } = useSmsCode();

const formRef = ref<HTMLElement & FormInst>();

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

async function handleSubmit() {
  await formRef.value?.validate();
  window.$message?.success('验证成功!');
}
</script>

<style scoped></style>
