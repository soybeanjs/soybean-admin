<script setup lang="ts">
import { computed } from 'vue';
import type { VNode } from 'vue';
import { useBoolean } from '@sa/hooks';
import { useAuthStore } from '@/store/modules/auth';
import { useRouteStore } from '@/store/modules/route';
import { useRouterPush } from '@/hooks/common/router';
import { useSvgIcon } from '@/hooks/common/icon';
import defaultAvatar from '@/assets/imgs/soybean.jpg';
import { $t } from '@/locales';

defineOptions({
  name: 'UserAvatar'
});

const authStore = useAuthStore();
const routeStore = useRouteStore();
const { routerPushByKey, toLogin } = useRouterPush();
const { bool: avatarError, setTrue: setError, setFalse: clearError } = useBoolean(false);
const { SvgIconVNode } = useSvgIcon();

function loginOrRegister() {
  toLogin();
}

type DropdownKey = 'logout' | 'admin' | 'disk' | 'switch-role' | 'personal-center';

type DropdownOption =
  | {
      key: DropdownKey;
      label: string;
      icon?: () => VNode;
    }
  | {
      type: 'divider';
      key: string;
    };

const options = computed(() => {
  const opts: DropdownOption[] = [
    {
      label: $t('common.userCenter'),
      key: 'personal-center',
      icon: SvgIconVNode({ icon: 'ph:user-circle', fontSize: 18 })
    },
    {
      label: $t('common.switchRole'),
      key: 'switch-role',
      icon: SvgIconVNode({ icon: 'ph:shuffle', fontSize: 18 })
    },
    {
      type: 'divider',
      key: 'divider-1'
    }
  ];

  // 根据当前模块显示对应的切换选项
  if (routeStore.currentModule === 'admin') {
    opts.push({
      label: $t('common.goToDisk'),
      key: 'disk',
      icon: SvgIconVNode({ icon: 'ic:outline-cloud', fontSize: 18 })
    });
  } else if (routeStore.currentModule === 'disk') {
    opts.push({
      label: $t('common.goToAdmin'),
      key: 'admin',
      icon: SvgIconVNode({ icon: 'mdi:monitor-dashboard', fontSize: 18 })
    });
  }

  return opts;
});

function handleAvatarLoad() {
  clearError();
}

function handleAvatarError() {
  setError();
}

function logout() {
  window.$dialog?.info({
    title: $t('common.tip'),
    content: $t('common.logoutConfirm'),
    positiveText: $t('common.confirm'),
    negativeText: $t('common.cancel'),
    onPositiveClick: () => {
      authStore.resetStore();
    }
  });
}

function handleDropdown(key: DropdownKey) {
  switch (key) {
    case 'logout':
      logout();
      break;
    case 'switch-role':
      window.$dialog?.info({
        title: $t('common.switchRole'),
        content: $t('common.switchRoleDesc'),
        positiveText: $t('common.confirm'),
        negativeText: $t('common.cancel'),
        onPositiveClick: () => {
          // 这里可以实现角色切换的具体逻辑
          // 例如跳转到角色选择页面或调用相关API
          window.$message?.info('Switch role clicked');
        }
      });
      break;
    case 'personal-center':
      if (routeStore.currentModule === 'disk') {
        routerPushByKey('personal-center');
      } else {
        routerPushByKey('admin-center');
      }
      break;
    default:
      routerPushByKey(key);
  }
}
</script>

<template>
  <NButton v-if="!authStore.isLogin" quaternary @click="loginOrRegister">
    {{ $t('page.login.common.loginOrRegister') }}
  </NButton>
  <NDropdown v-else placement="bottom" trigger="click" :options="options" @select="handleDropdown">
    <div class="flex cursor-pointer items-center rounded-md px-2 py-1 transition-colors duration-300 hover:bg-black/6">
      <div class="flex items-center gap-2" :class="{ 'opacity-50': avatarError }">
        <NAvatar
          v-if="authStore.userInfo.userAvatar"
          :size="32"
          round
          :src="authStore.userInfo.userAvatar"
          @load="handleAvatarLoad"
          @error="handleAvatarError"
        />
        <NAvatar v-else :size="32" round :src="defaultAvatar" @load="handleAvatarLoad" @error="handleAvatarError" />
        <span class="max-w-120px select-none truncate text-14px font-medium">
          {{ authStore.userInfo.nickName }}
        </span>
      </div>
    </div>
  </NDropdown>
</template>

<style scoped></style>
