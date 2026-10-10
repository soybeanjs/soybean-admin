<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import HideChildPanel from '../modules/hide-child-panel.vue';

// 隐藏子菜单 Three (P3-06)：one/two/three 是同一模板的三份实例 ——
// 路由各自独立（各占一个页签），菜单里不可见（hideInMenu: true），
// 侧栏高亮由 meta.activeMenu 指回父菜单 /function/hide-child。
defineOptions({ name: 'FunctionHideChildThree' });

const { t } = useI18n();

// 隐藏子菜单 Three (P3-06)：hideInMenu 让侧栏不出现该条目；
// activeMenu 指回父菜单路由名 FunctionHideChildIndex，保证高亮不掉。
definePage({
  meta: {
    title: '隐藏子菜单 3',
    i18nKey: 'route.functionHideChildThree',
    hideInMenu: true,
    activeMenu: 'FunctionHideChildIndex'
  }
});
</script>

<template>
  <HideChildPanel
    :title="t('route.functionHideChildThree')"
    :description="t('function.hideChild.description')"
    :route-label="t('function.hideChild.routeLabel')"
  />
</template>
