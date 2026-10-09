<script setup lang="ts">
import UserCenterSettings from '@/views/user-center/settings/index.vue';

/** 个人中心 · 设置页壳（见同目录 `profile.vue` 的 hideInMenu 说明）。 */
definePage({
  meta: {
    title: '个人设置',
    i18nKey: 'route.userCenterSettings',
    icon: 'mdi:cog-outline',
    hideInMenu: true
  }
});
</script>

<template>
  <UserCenterSettings />
</template>
