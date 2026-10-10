<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const PluginVideo = defineAsyncComponent(() => import('@/views/plugin/video/index.vue'));

/**
 * xgplayer 视频播放器。
 *
 * `src/pages/**` 只注册路由与菜单元信息，视图逻辑在 `src/views/**`（dynamic 路由
 * 模式只扫描 `src/views/**`）。
 */
definePage({
  meta: {
    title: '视频播放器',
    i18nKey: 'route.pluginVideo',
    icon: 'mdi:video',
    order: 54,
    menuParent: 'PluginIndex'
  }
});
</script>

<template>
  <PluginVideo />
</template>
