<script setup lang="ts">
import { computed, reactive } from 'vue';
import { $t } from '@/locales';
import { loginModuleRecord } from '@/constants/app';
import { useRouterPush } from '@/hooks/common/router';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { useAuthStore } from '@/store/modules/auth';
import { useAppStore } from '@/store/modules/app';
import { fetchGetWecomUrl } from '@/service/api';

defineOptions({
  name: 'PwdLogin'
});

const appStore = useAppStore();
const authStore = useAuthStore();
const { toggleLoginModule } = useRouterPush();
const { formRef, validate } = useNaiveForm();

interface FormModel {
  userName: string;
  password: string;
}

const model: FormModel = reactive({
  userName: 'Soybean',
  password: '123456'
});

const rules = computed<Record<keyof FormModel, App.Global.FormRule[]>>(() => {
  // inside computed to make locale reactive, if not apply i18n, you can define it without computed
  const { formRules } = useFormRules();

  return {
    userName: formRules.userName,
    password: formRules.pwd
  };
});

async function handleSubmit() {
  await validate();
  await authStore.login(model.userName, model.password);
}

async function getWecomInfo(info = false) {
  // 调用后端接口获取企业微信相关信息
  const { data: url, error } = await fetchGetWecomUrl(info);
  if (!error) {
    // 跳转到企业微信授权页面
    window.location.href = url;
  }
}

// 判断是否是手机和企业微信Webview的方法
const isMobileAndWecom = computed(() => {
  const userAgent = navigator.userAgent;
  const isWecom = /wxwork/i.test(userAgent);
  return !appStore.isMobile && !isWecom;
});

// 未实现功能告警
const handleFailed = () => {
  window.$message?.warning($t('page.login.common.infoWarning'));
};
</script>

<template>
  <NForm ref="formRef" :model="model" :rules="rules" size="large" :show-label="false" @keyup.enter="handleSubmit">
    <NFormItem path="userName">
      <NInput v-model:value="model.userName" :placeholder="$t('page.login.common.userNamePlaceholder')" />
    </NFormItem>
    <NFormItem path="password">
      <NInput
        v-model:value="model.password"
        type="password"
        show-password-on="click"
        :placeholder="$t('page.login.common.passwordPlaceholder')"
      />
    </NFormItem>
    <NSpace vertical :size="24">
      <div class="flex-y-center justify-between">
        <NCheckbox>{{ $t('page.login.pwdLogin.rememberMe') }}</NCheckbox>
        <NButton quaternary @click="toggleLoginModule('reset-pwd')">
          {{ $t('page.login.pwdLogin.forgetPassword') }}
        </NButton>
      </div>
      <NButton type="primary" size="large" round block :loading="authStore.loginLoading" @click="handleSubmit">
        {{ $t('common.confirm') }}
      </NButton>
      <div class="flex-y-center justify-between gap-12px">
        <NButton class="flex-1" block @click="toggleLoginModule('code-login')">
          {{ $t(loginModuleRecord['code-login']) }}
        </NButton>
        <NButton class="flex-1" block @click="toggleLoginModule('register')">
          {{ $t(loginModuleRecord.register) }}
        </NButton>
      </div>
      <NDivider class="text-14px text-#666 !m-0">{{ $t('page.login.pwdLogin.otherAccountLogin') }}</NDivider>
      <div class="flex-center gap-12px">
        <NButton v-if="isMobileAndWecom" quaternary class="text-20px lt-sm:text-18px" @click="getWecomInfo(true)">
          <template #icon>
            <icon-local-wecom />
          </template>
        </NButton>
        <NButton v-else text @click="getWecomInfo(false)">{{ $t('page.login.weComLogin.wecomOauth') }}</NButton>
        <NButton v-show="isMobileAndWecom" quaternary class="text-20px lt-sm:text-18px" @click="handleFailed">
          <template #icon>
            <icon-local-wechat />
          </template>
        </NButton>
        <NButton v-show="isMobileAndWecom" quaternary class="text-20px lt-sm:text-18px" @click="handleFailed">
          <template #icon>
            <icon-local-gitee />
          </template>
        </NButton>
      </div>
    </NSpace>
  </NForm>
</template>

<style scoped></style>
