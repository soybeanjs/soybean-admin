<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import MultiMenuPanel from '../modules/multi-menu-panel.vue';

/** 多级菜单演示 · 二级（P3-10）：侧栏里出现在一级「多级菜单」之下。 */
defineOptions({ name: 'MultiMenuFirst' });

const { t } = useI18n();

/** 多级菜单演示 · 二级（P3-10）：`menuParent` 指回一级路由名。 */
definePage({
  meta: {
    title: '二级菜单',
    i18nKey: 'route.multiMenuFirst',
    icon: 'mdi:menu',
    order: 27,
    menuParent: 'MultiMenuIndex'
  }
});
</script>

<template>
  <MultiMenuPanel :title="t('route.multiMenuFirst')" :description="t('multiMenu.secondDesc')" />
</template>
