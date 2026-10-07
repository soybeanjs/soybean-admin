<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { SButton, SInput, SPassword } from '@vean/ui';
import { useAuthStore } from '@/store/modules/auth';
import { getRouter } from '@/router/instance';

/**
 * 登录页（v3 §5.5，接入自家 `/api/auth/login`）。
 *
 * - 表单校验只做非空（服务端 valibot 兜底；业务错误由请求层 toast 出
 *   envelope 的 message，如 `2009` → 「用户名或密码错误」，这里 catch 住
 *   BackendError 不重复提示）。
 * - 成功后回跳：`?redirect=` 优先（守卫记录的来源页），否则 `homePath`。
 * - 布局走 `blank`（无壳），登录成功进入 default 布局。
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
const authStore = useAuthStore();

const userName = ref('');
const password = ref('');
const submitting = ref(false);
const errorMessage = ref('');

/** 回跳目标：query.redirect（守卫写入）优先，其次用户 homePath */
const redirectTarget = computed(() => {
  const redirect = route.query.redirect;

  return typeof redirect === 'string' && redirect.startsWith('/') ? redirect : authStore.homePath;
});

async function handleSubmit(): Promise<void> {
  if (!userName.value.trim() || !password.value) {
    errorMessage.value = '请输入用户名和密码';
    return;
  }

  errorMessage.value = '';
  submitting.value = true;

  try {
    await authStore.login(userName.value.trim(), password.value);
    await getRouter().replace(redirectTarget.value);
  } catch {
    // 业务错误已由请求层 toast；静默恢复按钮态
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <div class="flex-center h-full">
    <div class="w-80 rounded-lg border border-gray-200 p-8 dark:border-gray-800">
      <h1 class="mb-6 text-xl font-600">{{ t('common.login') }}</h1>

      <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
        <SInput v-model="userName" label="用户名" placeholder="admin" autocomplete="username" />
        <SPassword v-model="password" label="密码" placeholder="123456" autocomplete="current-password" />

        <p v-if="errorMessage" class="text-sm text-red-500">{{ errorMessage }}</p>

        <SButton type="submit" class="mt-2 w-full" :loading="submitting">
          {{ t('common.login') }}
        </SButton>
      </form>
    </div>
  </div>
</template>
