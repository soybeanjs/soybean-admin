<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const PluginSwiper = defineAsyncComponent(() => import('@/views/plugin/swiper/index.vue'));

/**
 * Swiper 八组配置演示。
 *
 * `src/pages/**` 只注册路由与菜单元信息，视图逻辑在 `src/views/**`（dynamic 路由
 * 模式只扫描 `src/views/**`）。
 */
definePage({
  meta: {
    title: '轮播',
    i18nKey: 'route.pluginSwiper',
    icon: 'mdi:view-carousel-outline',
    order: 56,
    menuParent: 'PluginIndex'
  }
});
</script>

<template>
  <PluginSwiper />
</template>
