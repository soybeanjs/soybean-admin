<script setup lang="ts">
import PasswordForm from './modules/password-form.vue';
import ProfileCard from './modules/profile-card.vue';
import ProfileForm from './modules/profile-form.vue';

/** 个人中心 · 资料（P3-09）：左侧身份概览 + 右侧资料编辑与修改密码 详见 docs/v3-notes.md N-384。 */

defineOptions({ name: 'UserCenterProfile' });

/** 个人中心 · 资料页 详见 docs/v3-notes.md N-385。 */

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
