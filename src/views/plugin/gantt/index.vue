<script setup lang="tsx">
import { onMounted, shallowRef } from 'vue';
import { gantt } from 'dhtmlx-gantt';
import type { ZoomLevels } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import { demoData } from './ganntData';

type ZoomConfig = {
  levels: ZoomLevels[];
};

const schema = shallowRef('quarter');

const data = [
  {
    name: '天',
    code: 'day'
  },
  {
    name: '周',
    code: 'week'
  },
  {
    name: '月',
    code: 'month'
  },
  {
    name: '季',
    code: 'quarter'
  },
  {
    name: '年',
    code: 'year'
  }
];

const zoomConfig: ZoomConfig = {
  levels: [
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
            const endDate = gantt.date.add(date, -6, 'day'); // 第几周
            return `${dateToStr(endDate)} 至 ${dateToStr(date)}`;
          }
        },
        {
          unit: 'day',
          step: 1,
          format: '%d',
          css(date: Date) {
            if (date.getDay() === 0 || date.getDay() === 6) {
              return 'day-item weekend weekend-border-bottom';
            }
            return 'day-item';
          }
        }
      ]
    },
    {
      name: 'month',
      scale_height: 60,
      min_column_width: 18,
      scales: [
        { unit: 'month', format: '%Y-%m' },
        {
          unit: 'day',
          step: 1,
          format: '%d',
          css(date: Date) {
            if (date.getDay() === 0 || date.getDay() === 6) {
              return 'day-item weekend weekend-border-bottom';
            }
            return 'day-item';
          }
        }
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
  ]
};

function scrollInit() {
  const nav = document.querySelector<HTMLElement>('.gantt_task')!;
  const parNav = document.querySelector<HTMLElement>('.gantt_hor_scroll')!;
  parNav.scrollLeft = 0;
  let flag: boolean = false;
  let downX: number = 0;
  let scrollLeft: number = 0;
  nav.addEventListener('mousedown', event => {
    flag = true;
    downX = event.clientX;

    scrollLeft = event.offsetX;
  });
  nav.addEventListener('mousemove', event => {
    if (flag) {
      const moveX = event.clientX;
      const scrollX = moveX - downX;
      parNav.scrollLeft = scrollLeft - scrollX;
    }
  });

  nav.addEventListener('mouseup', () => {
    flag = false;
  });

  nav.addEventListener('mouseleave', () => {
    flag = false;
  });
}

function initGantt() {
  gantt.config.grid_width = 350;
  gantt.config.add_column = false;

  gantt.config.autofit = false;
  gantt.config.row_height = 60;
  gantt.config.bar_height = 34;

  gantt.config.auto_types = true;
  gantt.config.xml_date = '%Y-%m-%d';

  gantt.config.columns = [
    {
      name: 'text',
      label: '项目名称',
      tree: true,
      width: '*'
    },
    {
      name: 'start_date',
      label: '开始时间',
      align: 'center',
      width: 150
    }
  ];

  gantt.i18n.setLocale('cn');
  gantt.init('gantt_here');
  gantt.parse(demoData);

  scrollInit();

  gantt.ext.zoom.init(zoomConfig);
  gantt.ext.zoom.setLevel(schema.value);
}

function changeTime(value: string) {
  schema.value = value;
  gantt.ext.zoom.setLevel(value);
}

onMounted(() => {
  initGantt();
});
</script>

<template>
  <div class="my-gantt min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NCard
      title="甘特图演示"
      :bordered="false"
      size="small"
      content-class="flex-x-center"
      class="sm:flex-1-hidden card-wrapper"
    >
      <template #header-extra>
        <NTabs :value="schema" type="segment" animated size="small" class="relative w-320px" @update:value="changeTime">
          <NTab v-for="item in data" :key="item.code" :name="item.code">
            {{ item.name }}
          </NTab>
        </NTabs>
      </template>

      <div id="gantt_here" class="gantt-container h-full w-full container"></div>
    </NCard>
  </div>
</template>

<style scoped lang="scss">
.my-gantt {
  ::v-deep .gantt-container {
    border-radius: 8px;
    overflow: hidden;
    height: 100%;
    .gantt_task_content {
      border-radius: 17px;
    }
    .gantt_task_line.gantt_project {
      border-radius: 17px;
      border: none;
      --uno: bg-primary;
    }
    .gantt_task_line {
      --uno: bg-primary-400;
      border: none;
      border-radius: 15px;
    }
    .gantt_grid_data .gantt_row.odd:hover,
    .gantt_grid_data .gantt_row:hover {
      --uno: bg-warning;
    }
    .gantt_task_row.gantt_selected .gantt_task_cell {
      --uno: bg-warning;
    }
    .gantt_grid_data .gantt_row.gantt_selected,
    .gantt_grid_data .gantt_row.odd.gantt_selected,
    .gantt_task_row.gantt_selected {
      --uno: bg-warning;
    }
  }
}
</style>
