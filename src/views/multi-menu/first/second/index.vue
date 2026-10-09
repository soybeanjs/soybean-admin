<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import MultiMenuPanel from '../../modules/multi-menu-panel.vue';

/** 多级菜单演示 · 二级（P3-10）：与「有子菜单」的二级同级，不带子项。 */
defineOptions({ name: 'MultiMenuSecond' });

const { t } = useI18n();
</script>

<template>
  <MultiMenuPanel :title="t('route.multiMenuSecond')" :description="t('multiMenu.secondDesc')" />
</template>
