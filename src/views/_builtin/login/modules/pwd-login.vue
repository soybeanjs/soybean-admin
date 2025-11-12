<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useAuthStore } from '@/store/modules/auth';
import { useRouterPush } from '@/hooks/common/router';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { useClickCaptcha } from '@/hooks/business/go-captcha';
import { localStg } from '@/utils/storage';
import { $t } from '@/locales';

defineOptions({
  name: 'PwdLogin'
});

const authStore = useAuthStore();
const { routerPushByKey } = useRouterPush();
const { formRef, validate } = useNaiveForm();
const remberMe = ref<boolean>(false);
// 使用验证码 hook
const {
  captchaDomRef,
  captchaShow,
  captchaToken,
  captchaVerified,
  clickData,
  clickConfigData,
  clickEvents,
  getCaptchaData
} = useClickCaptcha();

interface FormModel {
  userName: string;
  password: string;
}

const model: FormModel = reactive({
  userName: '',
  password: ''
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

  // 勾选了需要记住密码设置在 localStorage 中设置记住用户名和密码
  if (remberMe.value) {
    const { userName, password } = model;
    localStg.set('loginRember', { userName, password });
  } else {
    localStg.remove('loginRember');
  }

  await authStore.login(model.userName, model.password, captchaToken.value);
}

async function showCaptchaModal() {
  // 先获取验证码数据，再显示弹窗
  const data = await getCaptchaData();
  if (data) {
    captchaShow.value = true;
  }
}

function handleLoginRember() {
  const loginRember = localStg.get('loginRember');
  if (!loginRember) return;
  remberMe.value = true;
  Object.assign(model, loginRember);
}

handleLoginRember();
</script>

<template>
  <div>
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
      <!-- 验证码按钮-->
      <NFormItem>
        <NButton
          block
          size="large"
          :type="captchaVerified ? 'success' : 'default'"
          :disabled="captchaVerified"
          @click="showCaptchaModal"
        >
          <template #icon>
            <SvgIcon v-if="captchaVerified" local-icon="page-check_mark" />
            <SvgIcon v-else local-icon="page-click" />
          </template>
          {{ captchaVerified ? $t('page.login.captcha.validateSuccess') : $t('page.login.captcha.buttonText') }}
        </NButton>
      </NFormItem>
      <NSpace vertical :size="24">
        <div class="flex-y-center justify-between">
          <NCheckbox v-model:checked="remberMe">{{ $t('page.login.pwdLogin.rememberMe') }}</NCheckbox>
          <NSpace :size="1">
            <ButtonIcon class="color-#44b549" icon="ic:outline-wechat" />
            <ButtonIcon local-icon="page-wecom" />
            <ButtonIcon class="color-#c71d23" icon="simple-icons:gitee" />
          </NSpace>
        </div>
        <NButton type="primary" size="large" round block :loading="authStore.loginLoading" @click="handleSubmit">
          {{ $t('common.confirm') }}
        </NButton>
        <NButton type="primary" size="large" round block @click="routerPushByKey('init')">
          {{ $t('page.login.common.initButtonText') }}
        </NButton>
      </NSpace>
    </NForm>
    <!-- 验证码弹窗 -->
    <NModal v-model:show="captchaShow" :mask-closable="false" preset="card" class="w-400px" :closable="false">
      <div class="click-captcha mt-20px flex-center">
        <GoCaptchaClick
          ref="captchaDomRef"
          :data="clickData"
          :config="clickConfigData"
          :events="clickEvents"
        ></GoCaptchaClick>
      </div>
    </NModal>
  </div>
</template>

<style type="scss" scoped>
.click-captcha {
  --go-captcha-theme-btn-bg-color: rgb(var(--primary-color)) !important;
}
</style>
