<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const PluginIcon = defineAsyncComponent(() => import('@/views/plugin/icon/index.vue'));

/**
 * iconify 图标集合展示。
 *
 * `src/pages/**` 只注册路由与菜单元信息，视图逻辑在 `src/views/**`（dynamic 路由
 * 模式只扫描 `src/views/**`）。
 */
definePage({
  meta: {
    title: '图标',
    i18nKey: 'route.pluginIcon',
    icon: 'mdi:emoticon-outline',
    order: 41,
    menuParent: 'PluginIndex'
  }
});
</script>

<template>
  <PluginIcon />
</template>
