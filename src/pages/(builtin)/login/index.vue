<script lang="ts">
import type { Component } from 'vue';
import type { LoginLayoutName } from '@/constants/theme';
import BindWechat from '@/pages/(builtin)/login/modules/bind-wechat.vue';
import CodeLogin from '@/pages/(builtin)/login/modules/code-login.vue';
import PwdLogin from '@/pages/(builtin)/login/modules/pwd-login.vue';
import Register from '@/pages/(builtin)/login/modules/register.vue';
import ResetPwd from '@/pages/(builtin)/login/modules/reset-pwd.vue';
import { LOGIN_MODULE_TITLE_KEYS } from '@/pages/(builtin)/login/shared';
import type { LoginModule } from '@/pages/(builtin)/login/use-login';
import LoginLayoutCard from './components/card.vue';
import LoginLayoutFullscreen from './components/fullscreen.vue';
import LoginLayoutSplit from './components/split.vue';

/**
 * 模块与壳的注册表放**模块作用域**（普通 `<script>` 块）：放 setup 里会让对象被 Vue 响应式包装，
 * `<component :is>` 会警告 "made a component reactive" 详见 docs/v3-notes.md N-292。
 */
const moduleComponents: Record<LoginModule, Component> = {
  'pwd-login': PwdLogin,
  'code-login': CodeLogin,
  register: Register,
  'reset-pwd': ResetPwd,
  'bind-wechat': BindWechat
};

/** 壳注册表：键与 `LOGIN_LAYOUTS` 一一对应 */
const layoutComponents: Record<LoginLayoutName, Component> = {
  card: LoginLayoutCard,
  split: LoginLayoutSplit,
  fullscreen: LoginLayoutFullscreen
};

/** 注册表失配时的兜底壳（不该发生，但比渲染空白好） */
const FALLBACK_LAYOUT = layoutComponents.card;
</script>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useThemeStore } from '@/store/modules/theme';
import { resolveLoginModule } from '@/pages/(builtin)/login/use-login';

/** 详见 docs/v3-notes.md N-292：`@ubean/vue/dist/generator.js` 的 `renderRouteRecord`。 */
definePage({
  layout: 'blank',
  meta: {
    title: '登录',
    requiresAuth: false
  }
});

const route = useRoute();
const themeStore = useThemeStore();

const activeModule = computed(() => resolveLoginModule(route.query.module));

/**
 * 壳由主题设置决定（主题抽屉 → 通用 → 登录页布局）。
 * 组件库不认识登录页语义，所以查表而**不是**把值直接当组件名用。
 */
const activeLayout = computed(() => layoutComponents[themeStore.settings.loginLayout] ?? FALLBACK_LAYOUT);

/** 壳只收已解析的文案，不认识「模块」语义 */
const layoutProps = computed(() => ({
  title: LOGIN_MODULE_TITLE_KEYS[activeModule.value],
  description: '一个清新优雅的中后台模版'
}));
</script>

<template>
  <component :is="activeLayout" v-bind="layoutProps">
    <component :is="moduleComponents[activeModule]" />
  </component>
</template>
