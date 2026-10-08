<script setup lang="ts">
import ManageUser from '@/views/manage/user/index.vue';

/**
 * 用户管理页壳（P3-03）。
 *
 * 页面实现在 `src/views/manage/user/index.vue`：`src/pages/**` 只负责注册路由与
 * 菜单元信息，`src/views/**` 承担视图逻辑。
 */
definePage({
  meta: {
    title: '用户管理',
    i18nKey: 'route.manageUser',
    icon: 'mdi:account',
    order: 11
  }
});
</script>

<template>
  <ManageUser />
</template>
