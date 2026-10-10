<script setup lang="ts">
import PasswordForm from './modules/password-form.vue';
import ProfileCard from './modules/profile-card.vue';
import ProfileForm from './modules/profile-form.vue';

/**
 * 个人中心 · 资料（P3-09）：左侧身份概览 + 右侧资料编辑与修改密码。
 *
 * 为什么不用页签把「资料 / 密码」拆成两个视图：两块内容都不长，并排滚动比来回切
 * 页签少一次记忆负担（用户改完资料常顺手想改密码）。settings 侧内容体量更大且
 * 互不相关，才用 `STabs` 折叠。
 */

defineOptions({ name: 'UserCenterProfile' });

/**
 * 个人中心 · 资料页。
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
  <div class="grid grid-cols-1 items-start gap-4 xl:grid-cols-3">
    <ProfileCard class="xl:col-span-1" />
    <div class="flex flex-col gap-4 xl:col-span-2">
      <ProfileForm />
      <PasswordForm />
    </div>
  </div>
</template>
