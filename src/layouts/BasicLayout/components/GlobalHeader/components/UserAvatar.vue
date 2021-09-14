<template>
  <n-dropdown :options="options" @select="handleDropdown">
    <header-item class="px-12px">
      <n-avatar :src="avatar" :round="true" />
      <span class="pl-8px text-16px font-medium">Soybean</span>
    </header-item>
  </n-dropdown>
</template>

<script lang="ts" setup>
import { NDropdown, NAvatar } from 'naive-ui';
import { UserAvatar, Logout } from '@vicons/carbon';
import { dynamicIconRender } from '@/utils';
import HeaderItem from './HeaderItem.vue';
import avatar from '@/assets/img/common/logo-fill.png';
import { useAuthStore } from '@/store';

type DropdownKey = 'user-center' | 'logout';

const { resetAuthState } = useAuthStore();

const options = [
  {
    label: '用户中心',
    key: 'user-center',
    icon: dynamicIconRender(UserAvatar)
  },
  {
    type: 'divider',
    key: 'divider'
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: dynamicIconRender(Logout)
  }
];

function handleDropdown(key: DropdownKey) {
  if (key === 'logout') {
    resetAuthState();
  }
}
</script>
<style scoped></style>
