<template>
  <div class="relative flex-center w-full h-full bg-[#DBE0F9]">
    <div class="w-400px p-40px bg-white rounded-20px z-10">
      <header class="flex-y-center justify-between">
        <div class="w-70px h-70px rounded-35px overflow-hidden">
          <system-logo class="w-full h-full" :fill="true" />
        </div>
        <n-gradient-text type="primary" :size="28">{{ title }}</n-gradient-text>
      </header>
      <main class="pt-24px">
        <div v-for="item in modules" v-show="module === item.key" :key="item.key">
          <h3 class="text-18px g_text-primary font-medium">{{ item.label }}</h3>
          <component :is="item.component" />
        </div>
      </main>
    </div>
    <login-bg />
  </div>
</template>

<script lang="ts" setup>
import type { Component, PropType } from 'vue';
import { NGradientText } from 'naive-ui';
import { SystemLogo, LoginBg } from '@/components';
import { useAppTitle } from '@/hooks';
import { EnumLoginModule } from '@/enum';
import type { LoginModuleType } from '@/interface';
import { PwdLogin, CodeLogin, Register, ResetPwd, BindWechat } from './components';

interface LoginModule {
  key: LoginModuleType;
  label: string;
  component: Component;
}

defineProps({
  module: {
    type: String as PropType<LoginModuleType>,
    default: 'pwd-login'
  }
});

const title = useAppTitle();

const modules: LoginModule[] = [
  { key: 'pwd-login', label: EnumLoginModule['pwd-login'], component: PwdLogin },
  { key: 'code-login', label: EnumLoginModule['code-login'], component: CodeLogin },
  { key: 'register', label: EnumLoginModule.register, component: Register },
  { key: 'reset-pwd', label: EnumLoginModule['reset-pwd'], component: ResetPwd },
  { key: 'bind-wechat', label: EnumLoginModule['bind-wechat'], component: BindWechat }
];
</script>
<style scoped></style>
