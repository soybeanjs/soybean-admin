<template>
  <n-dropdown :options="options" @select="handleDropdown">
    <hover-container class="px-12px" :show-tooltip="false">
      <img :src="avatar" class="w-32px h-32px" />
      <span class="pl-8px text-16px font-medium">Soybean</span>
    </hover-container>
  </n-dropdown>
</template>

<script lang="ts" setup>
import { NDropdown, useDialog } from 'naive-ui';
import { UserAvatar, Logout } from '@vicons/carbon';
import { dynamicIconRender, resetAuthStorage } from '@/utils';
import { HoverContainer } from '@/components';
import avatar from '@/assets/svg/avatar/avatar01.svg';
import { useRouterChange } from '@/hooks';

type DropdownKey = 'user-center' | 'logout';

const { toLogin } = useRouterChange();
const dialog = useDialog();

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
    dialog.info({
      title: '提示',
      content: '您确定要退出登录吗？',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: () => {
        resetAuthStorage();
        toLogin('pwd-login', 'current');
      }
    });
  }
}
</script>
<style scoped></style>
