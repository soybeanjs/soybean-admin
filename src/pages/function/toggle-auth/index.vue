<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { SButton, SCard, STag, toast } from '@vean/ui';
import { useAuthStore } from '@/store/modules/auth';

/** 演示「角色/按钮权限」在真实账号上的差异： 详见 docs/v3-notes.md N-313。 */
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

definePage({
  meta: {
    title: '切换权限',
    i18nKey: 'route.functionToggleAuth',
    icon: 'mdi:account-switch',
    order: 23
  }
});
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
