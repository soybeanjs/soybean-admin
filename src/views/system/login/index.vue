<template>
  <div class="login-bg relative flex-center wh-full">
    <n-card :bordered="false" size="large" class="z-20 !w-auto rounded-20px shadow-sm">
      <div class="w-400px">
        <header class="flex-y-center justify-between">
          <div class="w-70px h-70px rounded-35px overflow-hidden">
            <system-logo class="wh-full" :fill="true" :color="theme.themeColor" />
          </div>
          <n-gradient-text type="primary" :size="28">{{ title }}</n-gradient-text>
        </header>
        <main class="pt-24px">
          <div v-for="item in modules" v-show="module === item.key" :key="item.key">
            <h3 class="text-18px text-primary font-medium">{{ item.label }}</h3>
            <component :is="item.component" />
          </div>
        </main>
      </div>
    </n-card>
    <login-bg :theme-color="theme.themeColor" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { Component } from 'vue';
import { NCard, NGradientText } from 'naive-ui';
import { SystemLogo, LoginBg } from '@/components';
import { useAppTitle } from '@/hooks';
import { EnumLoginModule } from '@/enum';
import { mixColor } from '@/utils';
import type { LoginModuleType } from '@/interface';
import { PwdLogin, CodeLogin, Register, ResetPwd, BindWechat } from './components';
import { useThemeStore } from '@/store';

interface Props {
  /** 登录模块分类 */
  module?: LoginModuleType;
}

interface LoginModule {
  key: LoginModuleType;
  label: string;
  component: Component;
}

withDefaults(defineProps<Props>(), {
  module: 'pwd-login'
});

const theme = useThemeStore();
const title = useAppTitle();

const modules: LoginModule[] = [
  { key: 'pwd-login', label: EnumLoginModule['pwd-login'], component: PwdLogin },
  { key: 'code-login', label: EnumLoginModule['code-login'], component: CodeLogin },
  { key: 'register', label: EnumLoginModule.register, component: Register },
  { key: 'reset-pwd', label: EnumLoginModule['reset-pwd'], component: ResetPwd },
  { key: 'bind-wechat', label: EnumLoginModule['bind-wechat'], component: BindWechat }
];

const bgColor = computed(() => mixColor('#ffffff', theme.themeColor, 0.3));
</script>
<style scoped>
.login-bg {
  background-color: v-bind(bgColor);
}
</style>
