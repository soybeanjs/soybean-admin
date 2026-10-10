<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import MultiMenuPanel from '../../modules/multi-menu-panel.vue';

/** 多级菜单演示 · 二级(有子菜单)（P3-10）：侧栏里是可展开分组，下面挂三级。 */
defineOptions({ name: 'MultiMenuSecondNew' });

const { t } = useI18n();

/**
 * 多级菜单演示 · 二级（有子菜单）（P3-10）。
 *
 * 「有子菜单的二级」在文件式路由里没有额外语法：一条平级记录 + `menuParent`
 * 指回一级即可，树形菜单会自动把它渲染成可展开的分组（`children` 非空）。
 */
definePage({
  meta: {
    title: '二级菜单（有子菜单）',
    i18nKey: 'route.multiMenuSecondNew',
    icon: 'mdi:folder-multiple-outline',
    order: 29,
    menuParent: 'MultiMenuFirstIndex'
  }
});
</script>

<template>
  <MultiMenuPanel :title="t('route.multiMenuSecondNew')" :description="t('multiMenu.secondNewDesc')" />
</template>
