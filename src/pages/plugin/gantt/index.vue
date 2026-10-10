<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { SCard } from '@vean/ui';
import { PluginGroup } from '../modules';

/** 甘特图分组落地页（P4-01）。 */
defineOptions({ name: 'PluginGanttIndex' });

const { t } = useI18n();

const links = [
  { path: '/plugin/gantt/dhtmlx', label: t('route.pluginGanttDhtmlx'), icon: 'mdi:chart-timeline-variant' },
  { path: '/plugin/gantt/vtable', label: t('route.pluginGanttVtable'), icon: 'mdi:table-clock' }
];

definePage({
  meta: {
    title: '甘特图',
    i18nKey: 'route.pluginGantt',
    icon: 'mdi:chart-gantt',
    order: 59,
    menuParent: 'PluginIndex'
  }
});
</script>

<template>
  <SCard :title="t('route.pluginGantt')">
    <PluginGroup :description="t('plugin.ganttTip')" :links="links" />
  </SCard>
</template>
