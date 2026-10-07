<script lang="ts">
import type { Component } from 'vue';
import BindWechat from '@/views/_builtin/login/modules/bind-wechat.vue';
import CodeLogin from '@/views/_builtin/login/modules/code-login.vue';
import PwdLogin from '@/views/_builtin/login/modules/pwd-login.vue';
import Register from '@/views/_builtin/login/modules/register.vue';
import ResetPwd from '@/views/_builtin/login/modules/reset-pwd.vue';
import type { LoginModule } from '@/views/_builtin/login/use-login';

/**
 * 模块注册表与标题 key 放**模块作用域**（普通 `<script>` 块）：
 * 放 setup 里会让对象被 Vue 响应式包装，`<component :is>` 会警告
 * "made a reactive object"。
 */
const moduleComponents: Record<LoginModule, Component> = {
  'pwd-login': PwdLogin,
  'code-login': CodeLogin,
  register: Register,
  'reset-pwd': ResetPwd,
  'bind-wechat': BindWechat
};

const moduleTitleKeys: Record<LoginModule, string> = {
  'pwd-login': 'common.login',
  'code-login': 'login.codeLogin',
  register: 'login.register',
  'reset-pwd': 'login.resetPwd',
  'bind-wechat': 'login.bindWechat'
};
</script>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { resolveLoginModule } from '@/views/_builtin/login/use-login';

/**
 * 登录页（v3 §4.6）：单路由多模块壳。
 *
 * `/login?module=<模块>` 切换子组件（密码登录 / 验证码登录 / 注册 / 重置密码 /
 * 绑定微信），与 v2 的 `views/_builtin/login/modules/*` 结构对齐 —— 5 个模块
 * 共用一条路由，回跳参数（`?redirect=`）在切换过程中由 `gotoLoginModule`
 * 原样保留。布局走 `blank`（无壳），登录成功进入 default 布局。
 */
definePage({
  layout: 'blank',
  requiresAuth: false,
  meta: {
    title: '登录'
  }
});

const { t } = useI18n();
const route = useRoute();

const activeModule = computed(() => resolveLoginModule(route.query.module));
const activeTitleKey = computed(() => moduleTitleKeys[activeModule.value]);
</script>

<template>
  <div class="flex-center h-full">
    <div class="w-96 rounded-lg border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h1 class="mb-1 text-center text-xl font-600">{{ t(activeTitleKey) }}</h1>
      <p class="mb-6 text-center text-sm text-gray-500">{{ t('app.description') }}</p>

      <component :is="moduleComponents[activeModule]" />
    </div>
  </div>
</template>
