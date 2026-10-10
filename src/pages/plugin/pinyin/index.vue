<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const PluginPinyin = defineAsyncComponent(() => import('@/views/plugin/pinyin/index.vue'));

/**
 * pinyin-pro 注音（带调 / 不带调 / 自定义样式）。
 *
 * `src/pages/**` 只注册路由与菜单元信息，视图逻辑在 `src/views/**`（dynamic 路由
 * 模式只扫描 `src/views/**`）。
 */
definePage({
  meta: {
    title: '拼音',
    i18nKey: 'route.pluginPinyin',
    icon: 'mdi:translate',
    order: 53,
    menuParent: 'PluginIndex'
  }
});
</script>

<template>
  <PluginPinyin />
</template>
