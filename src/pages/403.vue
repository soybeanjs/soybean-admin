<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { SButton, SIcon } from '@vean/ui';
import { useAuthStore } from '@/store/modules/auth';
import { getRouter } from '@/router/instance';

/**
 * 403 无权限（P3-06）。
 *
 * 触发点：`src/router/guard.ts` 的 `to.meta.roles` 判定不命中 → 重定向到这里
 * （带上 `?from=` 便于说明来源）。角色码判定复用 `@/shared/permission` 的
 * `hasRole`，与 `v-auth:role` 指令同一份纯函数。
 *
 * 「返回上一页」用 `router.back()` 而非 push 固定路径：403 可能来自任意页。
 * 直接输入 URL 进入时没有上一页，`back()` 会留在原地 —— 因此额外给「回到首页」。
 */
definePage({
  name: 'Forbidden',
  layout: 'blank',
  meta: {
    title: '无访问权限',
    i18nKey: 'common.forbidden',
    hideInMenu: true
  }
});

const { t } = useI18n();
const authStore = useAuthStore();

function goBack(): void {
  getRouter().back();
}

function goHome(): void {
  void getRouter().push(authStore.homePath);
}

function relogin(): void {
  void authStore.logout();
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 py-20">
    <SIcon icon="mdi:shield-alert-outline" class="text-6xl text-warning" />
    <p class="text-6xl font-700">403</p>
    <p class="text-sm opacity-70">{{ t('common.forbidden') }}</p>
    <p class="max-w-96 text-center text-sm opacity-60">{{ t('common.forbiddenDesc') }}</p>

    <div class="flex gap-3">
      <SButton variant="outline" @click="goBack">{{ t('common.goBack') }}</SButton>
      <SButton variant="soft" @click="goHome">{{ t('common.backHome') }}</SButton>
      <SButton variant="ghost" @click="relogin">{{ t('common.relogin') }}</SButton>
    </div>
  </div>
</template>
