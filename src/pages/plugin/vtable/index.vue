<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const PluginVtable = defineAsyncComponent(() => import('@/views/plugin/vtable/index.vue'));

/**
 * VisActor VTable：列表 / 分组 / 透视 / 透视图 / 自定义单元格五张表。
 *
 * `src/pages/**` 只注册路由与菜单元信息，视图逻辑在 `src/views/**`（dynamic 路由
 * 模式只扫描 `src/views/**`）。
 */
definePage({
  meta: {
    title: 'VTable 表格',
    i18nKey: 'route.pluginVtable',
    icon: 'mdi:table-large',
    order: 58,
    menuParent: 'PluginIndex'
  }
});
</script>

<template>
  <PluginVtable />
</template>
