<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import MultiMenuPanel from '../../../modules/multi-menu-panel.vue';

/** 多级菜单演示 · 三级（P3-10）：链长 4（一级 › 二级 › 二级(有子) › 三级）。 */
defineOptions({ name: 'MultiMenuThird' });

const { t } = useI18n();
</script>

<template>
  <MultiMenuPanel :title="t('route.multiMenuThird')" :description="t('multiMenu.thirdDesc')" />
</template>
