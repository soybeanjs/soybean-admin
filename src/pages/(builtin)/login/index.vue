<script lang="ts">
import type { Component } from 'vue';
import BindWechat from '@/pages/(builtin)/login/modules/bind-wechat.vue';
import CodeLogin from '@/pages/(builtin)/login/modules/code-login.vue';
import PwdLogin from '@/pages/(builtin)/login/modules/pwd-login.vue';
import Register from '@/pages/(builtin)/login/modules/register.vue';
import ResetPwd from '@/pages/(builtin)/login/modules/reset-pwd.vue';
import type { LoginModule } from '@/pages/(builtin)/login/use-login';

/** 模块注册表与标题 key 放**模块作用域**（普通 `<script>` 块）：放 setup 里会让对象被 Vue 响应式包装，`<component :is>` 会警告"made a。 */
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
import { SCard, SThemeModeSegment } from '@vean/ui';
import { APP_TITLE } from '@/constants';
import WaveBg from '@/components/wave-bg.vue';
import { resolveLoginModule } from '@/pages/(builtin)/login/use-login';

/** （`@ubean/vue/dist/generator.js` 的 `renderRouteRecord`：） 详见 docs/v3-notes.md N-292。 */
definePage({
  layout: 'blank',
  meta: {
    title: '登录',
    requiresAuth: false
  }
});

const { t } = useI18n();
const route = useRoute();

const activeModule = computed(() => resolveLoginModule(route.query.module));
const activeTitleKey = computed(() => moduleTitleKeys[activeModule.value]);
</script>

<template>
  <div class="relative flex-center size-full overflow-hidden bg-primary-200 dark:bg-primary-300 p-4">
    <WaveBg />

    <SCard
      size="lg"
      :ui="{
        root: 'relative z-2 w-full max-w-96',
        titleRoot: 'flex-1 justify-center',
        title: 'text-xl'
      }"
    >
      <template #title-leading>
        <AppLogo class="size-8" />
      </template>
      <template #title>{{ APP_TITLE }}</template>
      <template #extra>
        <SThemeModeSegment size="sm" />
      </template>

      <h2 class="text-center text-lg font-600 text-primary">{{ t(activeTitleKey) }}</h2>
      <p class="mt-1 mb-6 text-center text-sm text-muted-foreground">{{ t('app.description') }}</p>

      <component :is="moduleComponents[activeModule]" />
    </SCard>
  </div>
</template>
