<script setup lang="ts">
import MultiMenuIndex from '@/views/multi-menu/index.vue';

/**
 * 多级菜单演示 · 一级（P3-10，v3 §4.6「保留（文件目录天然表达）」）。
 *
 * 四个页面在磁盘上是平级的（文件式路由不产生嵌套），层级靠
 * `meta.menuParent` 显式声明而不是从 path 前缀猜：前缀推断会把 `/manage/*`
 * 八套管理页也折叠进一个大目录，那是导航结构的改变，不该由演示页决定。
 * 建树在 `src/store/modules/menu/index.ts` 的 `buildStaticMenuTree()`。
 */
definePage({
  meta: {
    title: '多级菜单',
    i18nKey: 'route.multiMenu',
    icon: 'mdi:file-tree',
    order: 26
  }
});
</script>

<template>
  <MultiMenuIndex />
</template>
