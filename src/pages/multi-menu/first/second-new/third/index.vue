<script setup lang="ts">
import MultiMenuThird from '@/views/multi-menu/first/second-new/third/index.vue';

/**
 * 多级菜单演示 · 三级（P3-10）。
 *
 * `menuParent: 'MultiMenuFirstSecondNewIndex'` 指回「二级（有子菜单）」—— 三级嵌套
 * 因此成立：一级 › 二级 › 二级(有子) › 三级，本页是第二级分组的子项。
 *
 * 注意父名取的是 ubean 由目录链推导的路由名（`/multi-menu/first/second-new` →
 * `MultiMenuFirstSecondNewIndex`），不是文件名拼音。
 */
definePage({
  meta: {
    title: '三级菜单',
    i18nKey: 'route.multiMenuThird',
    icon: 'mdi:menu-open',
    order: 30,
    menuParent: 'MultiMenuFirstSecondNewIndex'
  }
});
</script>

<template>
  <MultiMenuThird />
</template>
