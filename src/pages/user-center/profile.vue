<script setup lang="ts">
import UserCenterProfile from '@/views/user-center/profile/index.vue';

/**
 * 个人中心 · 资料页壳。
 *
 * `hideInMenu: true`：个人中心从右上角头像下拉进入，不进侧边菜单
 * （菜单是「按职责分区」的导航，个人中心是「当前用户」的附属入口）。
 * 两个子页互为平级，用切换按钮而非菜单表达。
 */

definePage({
  meta: {
    title: '个人资料',
    i18nKey: 'route.userCenterProfile',
    icon: 'mdi:account-circle-outline',
    hideInMenu: true
  }
});
</script>

<template>
  <UserCenterProfile />
</template>
