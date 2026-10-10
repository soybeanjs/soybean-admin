<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const PluginIndex = defineAsyncComponent(() => import('@/views/plugin/index.vue'));

/**
 * plugin 演示总入口（P4-01，v3 §5.8）。
 *
 * `src/pages/**` 只注册路由与菜单元信息，视图逻辑在 `src/views/**`（dynamic 路由
 * 模式只扫描 `src/views/**`）。
 */
definePage({
  meta: {
    title: '插件示例',
    i18nKey: 'route.plugin',
    icon: 'clarity:plugin-line',
    order: 7
  }
});
</script>

<template>
  <PluginIndex />
</template>
