<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import MultiMenuPanel from '../../modules/multi-menu-panel.vue';

/** 多级菜单演示 · 二级(有子菜单)（P3-10）：侧栏里是可展开分组，下面挂三级。 */
defineOptions({ name: 'MultiMenuSecondNew' });

const { t } = useI18n();
</script>

<template>
  <MultiMenuPanel :title="t('route.multiMenuSecondNew')" :description="t('multiMenu.secondNewDesc')" />
</template>
