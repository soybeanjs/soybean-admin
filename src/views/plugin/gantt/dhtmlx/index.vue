<script setup lang="ts">
import { onMounted, onUnmounted, shallowRef, useTemplateRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { SCard, SSegment } from '@vean/ui';
import { gantt } from 'dhtmlx-gantt';
import type { GanttConfigOptions, ZoomLevel } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import { ganttTasks } from './data';

/**
 * DHTMLX 甘特图演示（P4-01，v2 `gantt/dhtmlx/index.vue` 的移植）。
 *
 * 与 v2 的差异：
 * - `NCard` + `#header-extra` 里的 `NTabs type="segment"` → `SCard` 的 `extra` 槽
 *   + `SSegment`（`items` 是 required，`v-model:modelValue` 直接是 `TimeType`）；
 * - 时间粒度切到别的页签再回来时会重建 —— dhtmlx 的 `zoom` 扩展是**全局单例**
 *   （挂在 `gantt.ext` 上），多个实例互相覆盖，所以这里 `onUnmounted` 里清掉
 *   DOM 内容，避免残留状态；
 * - 任务条 / 表格文案来自 `t()`（v2 是硬编码中文）。
 *
 * 注意：dhtmlx-gantt 的 `gantt` 是模块级单例，一个页面只应实例化一次。
 */
defineOptions({ name: 'PluginGanttDhtmlx' });

const { t } = useI18n();

type TimeType = 'day' | 'week' | 'month' | 'quarter' | 'year';

const ganttRef = useTemplateRef<HTMLElement>('ganttRef');
const timeType = shallowRef<TimeType>('quarter');

/** 尺度的中文名 —— `t()` 参数必须是静态字面量，故逐条写死 */
const zoomItems = [
  { label: t('plugin.zoomDay'), value: 'day' },
  { label: t('plugin.zoomWeek'), value: 'week' },
  { label: t('plugin.zoomMonth'), value: 'month' },
  { label: t('plugin.zoomQuarter'), value: 'quarter' },
  { label: t('plugin.zoomYear'), value: 'year' }
];

function weekendCss(date: Date) {
  const day = date.getDay();

  return day === 0 || day === 6 ? 'day-item weekend weekend-border-bottom' : 'day-item';
}

function buildZoomLevels(): ZoomLevel[] {
  return [
    {
      name: 'day',
      scale_height: 60,
      scales: [{ unit: 'day', step: 1, format: '%d %M' }]
    },
    {
      name: 'week',
      scale_height: 60,
      scales: [
        {
          unit: 'week',
          step: 1,
          format(date: Date) {
            const dateToStr = gantt.date.date_to_str('%m-%d');
            const endDate = gantt.date.add(date, -6, 'day');

            return `${dateToStr(endDate)} 至 ${dateToStr(date)}`;
          }
        },
        { unit: 'day', step: 1, format: '%d', css: weekendCss }
      ]
    },
    {
      name: 'month',
      scale_height: 60,
      min_column_width: 18,
      scales: [
        { unit: 'month', format: '%Y-%m' },
        { unit: 'day', step: 1, format: '%d', css: weekendCss }
      ]
    },
    {
      name: 'quarter',
      height: 60,
      min_column_width: 110,
      scales: [
        {
          unit: 'quarter',
          step: 1,
          format(date: Date) {
            const yearStr = `${new Date(date).getFullYear()}年`;
            const dateToStr = gantt.date.date_to_str('%M');
            const endDate = gantt.date.add(gantt.date.add(date, 3, 'month'), -1, 'day');

            return `${yearStr + dateToStr(date)} - ${dateToStr(endDate)}`;
          }
        },
        {
          unit: 'week',
          step: 1,
          format(date: Date) {
            const dateToStr = gantt.date.date_to_str('%m-%d');
            const endDate = gantt.date.add(date, 6, 'day');

            return `${dateToStr(date)} 至 ${dateToStr(endDate)}`;
          }
        }
      ]
    },
    {
      name: 'year',
      scale_height: 50,
      min_column_width: 150,
      scales: [
        { unit: 'year', step: 1, format: '%Y年' },
        { unit: 'month', format: '%Y-%m' }
      ]
    }
  ];
}

/** 只初始化一次；`timeType` 变化走 `zoom.setLevel()`，不重建 */
function initGantt() {
  const container = ganttRef.value;

  if (!container) return;

  const config: Partial<GanttConfigOptions> = {
    grid_width: 350,
    add_column: false,
    autofit: false,
    row_height: 60,
    bar_height: 34,
    auto_types: true,
    xml_date: '%Y-%m-%d',
    columns: [
      { name: 'text', label: t('plugin.ganttColumnName'), tree: true, width: '*' },
      { name: 'start_date', label: t('plugin.ganttColumnStart'), align: 'center', width: 150 }
    ]
  };

  Object.assign(gantt.config, config);

  gantt.i18n.setLocale('cn');
  gantt.init(container);
  gantt.parse({ data: ganttTasks });

  gantt.ext.zoom.init({ levels: buildZoomLevels() });
  gantt.ext.zoom.setLevel(timeType.value);
}

const stopTimeWatch = watch(timeType, value => {
  gantt.ext.zoom.setLevel(value);
});

onMounted(() => {
  initGantt();
});

onUnmounted(() => {
  stopTimeWatch();
  // 单例：清掉 DOM，避免下次进来读到上一次的甘特图节点
  gantt.clearAll();
});
</script>

<template>
  <SCard :title="t('plugin.gantt')">
    <template #extra>
      <SSegment v-model="timeType" :items="zoomItems" size="sm" />
    </template>

    <div ref="ganttRef" class="h-150 w-full min-w-200 overflow-hidden" />
  </SCard>
</template>
