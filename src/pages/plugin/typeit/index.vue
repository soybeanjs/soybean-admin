<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const PluginTypeit = defineAsyncComponent(() => import('@/views/plugin/typeit/index.vue'));

/**
 * TypeIt 打字机动画。
 *
 * `src/pages/**` 只注册路由与菜单元信息，视图逻辑在 `src/views/**`（dynamic 路由
 * 模式只扫描 `src/views/**`）。
 */
definePage({
  meta: {
    title: '打字机',
    i18nKey: 'route.pluginTypeit',
    icon: 'mdi:typewriter',
    order: 57,
    menuParent: 'PluginIndex'
  }
});
</script>

<template>
  <PluginTypeit />
</template>
