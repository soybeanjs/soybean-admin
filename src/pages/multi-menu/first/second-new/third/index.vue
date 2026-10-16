<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import MultiMenuPanel from '../../../modules/multi-menu-panel.vue';

/** 多级菜单演示 · 三级（P3-10）：链长 4（一级 › 二级 › 二级(有子) › 三级）。 */
defineOptions({ name: 'MultiMenuThird' });

const { t } = useI18n();

/** 注意父名取的是 ubean 由目录链推导的路由名（`/multi-menu/first/second-new` →） 详见 docs/v3-notes.md N-336。 */
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
  <MultiMenuPanel :title="t('route.multiMenuThird')" :description="t('multiMenu.thirdDesc')" />
</template>
