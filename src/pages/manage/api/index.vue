<script setup lang="ts">
import ManageApi from '@/views/manage/api/index.vue';

/**
 * 接口管理页壳（P3-03）。
 *
 * 页面实现在 `src/views/manage/api/index.vue`：`src/pages/**` 只负责注册路由与
 * 菜单元信息，`src/views/**` 承担视图逻辑（理由见 `docs/v3.md` 的目录蓝图，
 * 且 dynamic 路由模式只扫描 `src/views/**`）。
 */
definePage({
  meta: {
    title: '接口管理',
    i18nKey: 'route.manageApi',
    icon: 'mdi:api',
    order: 10
  }
});
</script>

<template>
  <ManageApi />
</template>
