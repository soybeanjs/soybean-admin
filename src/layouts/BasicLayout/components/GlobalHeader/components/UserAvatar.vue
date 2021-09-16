<template>
  <n-dropdown :options="options" @select="handleDropdown">
    <header-item class="px-12px">
      <n-avatar :src="avatar" size="small" :round="true" />
      <span class="pl-8px text-16px font-medium">Soybean</span>
    </header-item>
  </n-dropdown>
</template>

<script lang="ts" setup>
import { NDropdown, NAvatar } from 'naive-ui';
import { UserAvatar, Logout } from '@vicons/carbon';
import { dynamicIconRender, resetAuthStorage } from '@/utils';
import HeaderItem from './HeaderItem.vue';
import avatar from '@/assets/img/common/logo-fill.png';

type DropdownKey = 'user-center' | 'logout';

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

function handleDropdown(optionKey: string) {
  const key = optionKey as DropdownKey;
  if (key === 'logout') {
    resetAuthStorage();
    window.location.reload();
  }
}
</script>
<style scoped></style>
