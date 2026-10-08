<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { SButton, SCard, STag, toast } from '@vean/ui';
import { useAuthStore } from '@/store/modules/auth';

/**
 * 切换权限（P3-06，v3 §4.6）。
 *
 * 演示「角色/按钮权限」在真实账号上的差异：
 * - `admin`（角色 `super`）→ 路由级全通、`buttons` 为全量权限码；
 * - `user`（角色 `user`）→ 无 `system:user:*` 权限码，`function/super-page`
 *   声明了 `meta.roles: ['super']`，切到 user 访问会落 403。
 *
 * 切换账号 = 重新登录 + **整页重载**：`v-auth` 指令只在 `mounted` 判定一次
 * （与 v2 语义一致），动态重建指令不如直接 reload 干净；菜单树也随重载重新
 * 初始化。按钮示例用 `v-auth` 静态字面量数组写法。
 */
defineOptions({ name: 'FunctionToggleAuth' });

const { t } = useI18n();
const authStore = useAuthStore();

const switching = ref(false);

const currentAccount = computed(() => authStore.userInfo?.username ?? '-');
const currentRoles = computed(() => authStore.userInfo?.roles ?? []);
const currentButtons = computed(() => authStore.userInfo?.buttons ?? []);

/** 切换账号：重新登录后整页重载，让菜单/权限/指令全部按新身份重建 */
async function switchAccount(userName: string): Promise<void> {
  switching.value = true;

  try {
    await authStore.login(userName, '123456');
    toast.success(t('function.toggleAuth.switchDone'));

    // 只读的全局刷新：SSR 预渲染环境到不了这里（点击事件仅存在于浏览器）
    window.location.reload();
  } catch {
    switching.value = false;
  }
}

function toSuper() {
  void switchAccount('admin');
}

function toUser() {
  void switchAccount('user');
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <SCard :title="t('function.toggleAuth.title')">
      <p class="text-sm opacity-70">{{ t('function.toggleAuth.description') }}</p>

      <dl class="mt-4 grid grid-cols-1 gap-3 text-sm lt-md:grid-cols-1 md:grid-cols-3">
        <div>
          <dt class="opacity-60">{{ t('function.toggleAuth.currentAccount') }}</dt>
          <dd class="font-600">{{ currentAccount }}</dd>
        </div>
        <div>
          <dt class="opacity-60">{{ t('function.toggleAuth.currentRoles') }}</dt>
          <dd class="flex flex-wrap gap-1">
            <STag v-for="role in currentRoles" :key="role" variant="soft" color="primary">{{ role }}</STag>
            <span v-if="currentRoles.length === 0">-</span>
          </dd>
        </div>
        <div>
          <dt class="opacity-60">{{ t('function.toggleAuth.currentButtons') }}</dt>
          <dd class="font-600">{{ currentButtons.length }}</dd>
        </div>
      </dl>
    </SCard>

    <SCard :title="t('function.toggleAuth.switchTo')">
      <div class="flex flex-wrap gap-3">
        <SButton variant="soft" color="primary" :loading="switching" @click="toSuper">admin</SButton>
        <SButton variant="soft" color="warning" :loading="switching" @click="toUser">user</SButton>
      </div>
      <p class="mt-3 text-sm opacity-60">{{ t('function.toggleAuth.account') }}</p>
    </SCard>

    <SCard :title="t('function.toggleAuth.buttonDemo')">
      <div class="flex flex-wrap items-center gap-3">
        <SButton v-auth="['system:user:add']" variant="outline" color="success">system:user:add（超管可见）</SButton>
        <SButton v-auth="['api:get:(/user/list)']" variant="outline">api:get:(/user/list)（两账号可见）</SButton>
        <SButton v-auth.super variant="outline" color="info">
          {{ t('function.toggleAuth.superOnly') }}
        </SButton>
        <SButton v-auth:role="['super']" variant="outline" color="warning">
          {{ t('function.toggleAuth.adminOnly') }}
        </SButton>
      </div>
      <p v-if="currentButtons.length === 0" class="mt-3 text-sm opacity-60">
        {{ t('function.toggleAuth.noButtons') }}
      </p>
    </SCard>
  </div>
</template>
