<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const PluginMap = defineAsyncComponent(() => import('@/views/plugin/map/index.vue'));

/**
 * 高德 / 腾讯 / 百度三图 SDK 直连（无 key，用官方示例 SDK 地址）。
 *
 * `src/pages/**` 只注册路由与菜单元信息，视图逻辑在 `src/views/**`（dynamic 路由
 * 模式只扫描 `src/views/**`）。
 */
definePage({
  meta: {
    title: '地图',
    i18nKey: 'route.pluginMap',
    icon: 'mdi:map',
    order: 55,
    menuParent: 'PluginIndex'
  }
});
</script>

<template>
  <PluginMap />
</template>
