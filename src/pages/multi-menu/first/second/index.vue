<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import MultiMenuPanel from '../../modules/multi-menu-panel.vue';

/** 多级菜单演示 · 二级（P3-10）：与「有子菜单」的二级同级，不带子项。 */
defineOptions({ name: 'MultiMenuSecond' });

const { t } = useI18n();

/** 多级菜单演示 · 二级（P3-10）：`menuParent` 指回上一级路由名。 */
definePage({
  meta: {
    title: '二级菜单',
    i18nKey: 'route.multiMenuSecond',
    icon: 'mdi:menu',
    order: 28,
    menuParent: 'MultiMenuFirstIndex'
  }
});
</script>

<template>
  <MultiMenuPanel :title="t('route.multiMenuSecond')" :description="t('multiMenu.secondDesc')" />
</template>
