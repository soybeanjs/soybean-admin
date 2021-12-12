<template>
  <div class="login-bg relative flex-center wh-full">
    <n-card :bordered="false" size="large" class="z-20 !w-auto rounded-20px shadow-sm">
      <div class="w-360px">
        <header class="flex-y-center justify-between">
          <div class="w-70px h-70px rounded-35px overflow-hidden">
            <system-logo class="wh-full" :fill="true" :color="theme.themeColor" />
          </div>
          <n-gradient-text type="primary" :size="28">{{ title }}</n-gradient-text>
        </header>
        <main class="pt-24px">
          <h3 class="text-18px text-primary font-medium">{{ activeModule.label }}</h3>
          <component :is="activeModule.component" />
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
import { useAppInfo } from '@/composables';
import { EnumLoginModule } from '@/enum';
import { mixColor } from '@/utils';
import type { LoginModuleType } from '@/interface';
import { PwdLogin, CodeLogin, Register, ResetPwd, BindWechat } from './components';
import { useThemeStore } from '@/store';

interface Props {
  /** 登录模块分类 */
  module: LoginModuleType;
}

interface LoginModule {
  key: LoginModuleType;
  label: string;
  component: Component;
}

const props = defineProps<Props>();

const theme = useThemeStore();
const { title } = useAppInfo();

const modules: LoginModule[] = [
  { key: 'pwd-login', label: EnumLoginModule['pwd-login'], component: PwdLogin },
  { key: 'code-login', label: EnumLoginModule['code-login'], component: CodeLogin },
  { key: 'register', label: EnumLoginModule.register, component: Register },
  { key: 'reset-pwd', label: EnumLoginModule['reset-pwd'], component: ResetPwd },
  { key: 'bind-wechat', label: EnumLoginModule['bind-wechat'], component: BindWechat }
];

const activeModule = computed(() => {
  const active: LoginModule = { ...modules[0] };
  const findItem = modules.find(item => item.key === props.module);
  if (findItem) {
    Object.assign(active, findItem);
  }
  return active;
});

const bgColor = computed(() => {
  const COLOR_WHITE = '#ffffff';
  const ratio = theme.darkMode ? 0.6 : 0.3;
  return mixColor(COLOR_WHITE, theme.themeColor, ratio);
});
</script>
<style scoped>
.login-bg {
  background-color: v-bind(bgColor);
}
</style>
