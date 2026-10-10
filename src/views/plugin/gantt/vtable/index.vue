<script setup lang="ts">
import { computed, onMounted, onUnmounted, shallowRef, useTemplateRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { SCard, useTheme } from '@vean/ui';
import type { TYPES as VTableTypes } from '@visactor/vtable';
import * as VTable_editors from '@visactor/vtable-editors';
import * as VTableGantt from '@visactor/vtable-gantt';
import { PluginDocLinks } from '../../modules';
import { basicGanttRecords, customGanttRecords, linkGanttRecords } from './data';

/**
 * VTable Gantt 的三种用法（P4-01，v2 `views/plugin/gantt/vtable/index.vue` 的移植）。
 *
 * 与 v2 的差异：
 * - `useThemeStore().darkMode` → `useTheme().effectiveMode`（v3 无 theme store）；
 * - 去掉全部 `any` 与 `as` 断言：`format` 收 `DateFormatArgumentType`，
 *   `customLayout` 收 vtable 的 `CustomRenderFunctionArg` / gantt 的
 *   `TaskBarCustomLayoutArgumentType`，容器 ref 用 `useTemplateRef<HTMLElement>`；
 * - 三个实例在 `onUnmounted` 里 `release()`（v2 只停 watch，没释放 canvas）；
 * - `NSpace` / `NCard` / 全局 `WebSiteLink` → `SCard` + `PluginDocLinks`。
 */

/** 表格编辑器注册（vtable 的全局注册表，模块级执行一次即可） */
VTableGantt.VTable.register.editor('input', new VTable_editors.InputEditor());
VTableGantt.VTable.register.editor('date-input', new VTable_editors.DateInputEditor());

/** `VTable.themes.*` 的实例类型（`extends()` 定义在 `TableTheme` 上，不是 `ITableThemeDefine`） */
type VTableTheme = typeof VTableGantt.VTable.themes.DEFAULT;

/** 自定义任务条/表头用的两套取色池 */
const barColors0 = ['#aecde6', '#c6a49a', '#ffb582', '#eec1de', '#b3d9b3', '#cccccc', '#e59a9c', '#d9d1a5', '#c9bede'];
const barColors = ['#1f77b4', '#8c564b', '#ff7f0e', '#e377c2', '#2ca02c', '#7f7f7f', '#d62728', '#bcbd22', '#9467bd'];

/** 自定义时间轴表头的日历图标（内联 SVG，避免额外资源请求） */
const CALENDAR_ICON = `<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="200" height="200"><path d="M53.085678 141.319468C23.790257 141.319468 0 165.035326 0 194.34775L0 918.084273C0 947.295126 23.796789 971.112572 53.085678 971.112572L970.914322 971.112572C1000.209743 971.112572 1024 947.396696 1024 918.084273L1024 194.34775C1024 165.136896 1000.203211 141.319468 970.914322 141.319468L776.827586 141.319468 812.137931 176.629813 812.137931 88.275862C812.137931 68.774506 796.328942 52.965517 776.827586 52.965517 757.32623 52.965517 741.517241 68.774506 741.517241 88.275862L741.517241 176.629813 741.517241 211.940158 776.827586 211.940158 970.914322 211.940158C961.186763 211.940158 953.37931 204.125926 953.37931 194.34775L953.37931 918.084273C953.37931 908.344373 961.25643 900.491882 970.914322 900.491882L53.085678 900.491882C62.813237 900.491882 70.62069 908.306097 70.62069 918.084273L70.62069 194.34775C70.62069 204.087649 62.74357 211.940158 53.085678 211.940158L247.172414 211.940158C266.67377 211.940158 282.482759 196.131169 282.482759 176.629813 282.482759 157.128439 266.67377 141.319468 247.172414 141.319468L53.085678 141.319468ZM211.862069 176.629813C211.862069 196.131169 227.671058 211.940158 247.172414 211.940158 266.67377 211.940158 282.482759 196.131169 282.482759 176.629813L282.482759 88.275862C282.482759 68.774506 266.67377 52.965517 247.172414 52.965517 227.671058 52.965517 211.862069 68.774506 211.862069 88.275862L211.862069 176.629813ZM1024 353.181537 1024 317.871192 988.689655 317.871192 35.310345 317.871192 0 317.871192 0 353.181537 0 441.457399C0 460.958755 15.808989 476.767744 35.310345 476.767744 54.811701 476.767744 70.62069 460.958755 70.62069 441.457399L70.62069 353.181537 35.310345 388.491882 988.689655 388.491882 953.37931 353.181537 953.37931 441.457399C953.37931 460.958755 969.188299 476.767744 988.689655 476.767744 1008.191011 476.767744 1024 460.958755 1024 441.457399L1024 353.181537ZM776.937913 582.62069C796.439287 582.62069 812.248258 566.811701 812.248258 547.310345 812.248258 527.808989 796.439287 512 776.937913 512L247.172414 512C227.671058 512 211.862069 527.808989 211.862069 547.310345 211.862069 566.811701 227.671058 582.62069 247.172414 582.62069L776.937913 582.62069ZM247.172414 688.551724C227.671058 688.551724 211.862069 704.360713 211.862069 723.862069 211.862069 743.363425 227.671058 759.172414 247.172414 759.172414L600.386189 759.172414C619.887563 759.172414 635.696534 743.363425 635.696534 723.862069 635.696534 704.360713 619.887563 688.551724 600.386189 688.551724L247.172414 688.551724ZM776.827586 211.940158 741.517241 176.629813 741.517241 247.328574C741.517241 266.829948 757.32623 282.638919 776.827586 282.638919 796.328942 282.638919 812.137931 266.829948 812.137931 247.328574L812.137931 176.629813 812.137931 141.319468 776.827586 141.319468 247.172414 141.319468C227.671058 141.319468 211.862069 157.128439 211.862069 176.629813 211.862069 196.131169 227.671058 211.940158 247.172414 211.940158L776.827586 211.940158ZM282.482759 176.629813C282.482759 157.128439 266.67377 141.319468 247.172414 141.319468 227.671058 141.319468 211.862069 157.128439 211.862069 176.629813L211.862069 247.328574C211.862069 266.829948 227.671058 282.638919 247.172414 282.638919 266.67377 282.638919 282.482759 266.829948 282.482759 247.328574L282.482759 176.629813Z" fill="#389BFF"></path></svg>`;

/** 任务表列定义（三个实例共用的基础列） */
function taskColumns(withSort: boolean): VTableGantt.ColumnsDefine {
  return [
    {
      field: 'title',
      title: 'title',
      width: 'auto',
      tree: true,
      ...(withSort ? { sort: true } : {}),
      editor: 'input'
    },
    { field: 'start', title: 'start', width: 'auto', ...(withSort ? { sort: true } : {}), editor: 'date-input' },
    { field: 'end', title: 'end', width: 'auto', ...(withSort ? { sort: true } : {}), editor: 'date-input' },
    { field: 'priority', title: 'priority', width: 'auto', ...(withSort ? { sort: true } : {}), editor: 'input' },
    {
      field: 'progress',
      title: 'progress',
      width: 'auto',
      ...(withSort ? { sort: true } : {}),
      headerStyle: { borderColor: '#e1e4e8' },
      style: { borderColor: '#e1e4e8', color: 'green' },
      editor: 'input'
    }
  ];
}

/** 基础甘特图：单层任务 + 两条标记线 + 可拖动排序 */
const basicGanttOption: VTableGantt.GanttConstructorOptions = {
  overscrollBehavior: 'none',
  records: basicGanttRecords,
  taskListTable: {
    columns: taskColumns(true),
    tableWidth: 250,
    minTableWidth: 100,
    maxTableWidth: 600
  },
  frame: {
    outerFrameStyle: { borderLineWidth: 2, borderColor: '#e1e4e8', cornerRadius: 8 },
    verticalSplitLine: { lineColor: '#e1e4e8', lineWidth: 3 },
    horizontalSplitLine: { lineColor: '#e1e4e8', lineWidth: 3 },
    verticalSplitLineMoveable: true,
    verticalSplitLineHighlight: { lineColor: 'green', lineWidth: 3 }
  },
  grid: {
    verticalLine: { lineWidth: 1, lineColor: '#e1e4e8' },
    horizontalLine: { lineWidth: 1, lineColor: '#e1e4e8' }
  },
  headerRowHeight: 40,
  rowHeight: 40,
  taskBar: {
    startDateField: 'start',
    endDateField: 'end',
    progressField: 'progress',
    moveable: true,
    hoverBarStyle: { barOverlayColor: 'rgba(99, 144, 0, 0.4)' },
    labelText: '{title} {progress}%',
    labelTextStyle: { fontFamily: 'Arial', fontSize: 16, textAlign: 'left', textOverflow: 'ellipsis' },
    barStyle: { width: 20, barColor: '#ee8800', completedBarColor: '#91e8e0', cornerRadius: 8 }
  },
  timelineHeader: {
    colWidth: 100,
    backgroundColor: '#EEF1F5',
    horizontalLine: { lineWidth: 1, lineColor: '#e1e4e8' },
    verticalLine: { lineWidth: 1, lineColor: '#e1e4e8' },
    scales: [
      {
        unit: 'week',
        step: 1,
        startOfWeek: 'sunday',
        format: weekLabel,
        style: {
          fontSize: 20,
          fontWeight: 'bold',
          color: 'white',
          strokeColor: 'black',
          textAlign: 'right',
          textBaseline: 'bottom',
          textStick: true
        }
      },
      {
        unit: 'day',
        step: 1,
        format: dayIndexLabel,
        style: {
          fontSize: 20,
          fontWeight: 'bold',
          color: 'white',
          strokeColor: 'black',
          textAlign: 'right',
          textBaseline: 'bottom'
        }
      }
    ]
  },
  markLine: [
    { content: '', date: '2024-07-28', style: { lineWidth: 1, lineColor: 'blue', lineDash: [8, 4] } },
    { content: '', date: '2024-08-17', style: { lineWidth: 2, lineColor: 'red', lineDash: [8, 4] } }
  ],
  scrollStyle: {
    scrollRailColor: 'RGBA(246,246,246,0.5)',
    visible: 'scrolling',
    width: 6,
    scrollSliderCornerRadius: 2,
    scrollSliderColor: '#5cb85c'
  }
};

/** 任务依赖：四条连线覆盖 gantt 支持的全部 `DependencyType` */
const linkGanttOption: VTableGantt.GanttConstructorOptions = {
  records: linkGanttRecords,
  taskListTable: { columns: taskColumns(false), tableWidth: 400, minTableWidth: 100, maxTableWidth: 600 },
  dependency: {
    links: [
      { type: VTableGantt.TYPES.DependencyType.FinishToStart, linkedFromTaskKey: 1, linkedToTaskKey: 2 },
      { type: VTableGantt.TYPES.DependencyType.StartToFinish, linkedFromTaskKey: 2, linkedToTaskKey: 3 },
      { type: VTableGantt.TYPES.DependencyType.StartToStart, linkedFromTaskKey: 3, linkedToTaskKey: 4 },
      { type: VTableGantt.TYPES.DependencyType.FinishToFinish, linkedFromTaskKey: 4, linkedToTaskKey: 5 }
    ],
    linkSelectedLineStyle: { shadowBlur: 5, shadowColor: 'red', lineColor: 'red', lineWidth: 1 }
  },
  frame: {
    verticalSplitLineMoveable: true,
    outerFrameStyle: { borderLineWidth: 2, cornerRadius: 8 },
    verticalSplitLine: { lineWidth: 3, lineColor: '#e1e4e8' },
    verticalSplitLineHighlight: { lineColor: 'green', lineWidth: 3 }
  },
  grid: {
    verticalLine: { lineWidth: 1, lineColor: '#e1e4e8' },
    horizontalLine: { lineWidth: 1, lineColor: '#e1e4e8' }
  },
  headerRowHeight: 60,
  rowHeight: 40,
  taskBar: {
    startDateField: 'start',
    endDateField: 'end',
    progressField: 'progress',
    labelText: '{title} {progress}%',
    labelTextStyle: { fontFamily: 'Arial', fontSize: 16, textAlign: 'left' },
    barStyle: { width: 20, barColor: '#ee8800', completedBarColor: '#91e8e0', cornerRadius: 10 },
    selectedBarStyle: {
      shadowBlur: 5,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      shadowColor: 'black',
      borderColor: 'red',
      borderLineWidth: 1
    }
  },
  timelineHeader: {
    verticalLine: { lineWidth: 1, lineColor: '#e1e4e8' },
    horizontalLine: { lineWidth: 1, lineColor: '#e1e4e8' },
    backgroundColor: '#EEF1F5',
    colWidth: 60,
    scales: [
      {
        unit: 'week',
        step: 1,
        startOfWeek: 'sunday',
        format: weekLabel,
        style: { fontSize: 20, fontWeight: 'bold', color: 'red' }
      },
      {
        unit: 'day',
        step: 1,
        format: dayIndexLabel,
        style: { fontSize: 20, fontWeight: 'bold', color: 'red' }
      }
    ]
  },
  minDate: '2024-07-14',
  maxDate: '2024-10-15',
  scrollStyle: { visible: 'scrolling' },
  overscrollBehavior: 'none'
};

/** 自定义渲染：任务条与时间轴表头都由 `VRender` 自绘 */
const customGanttOption: VTableGantt.GanttConstructorOptions = {
  records: customGanttRecords,
  taskListTable: {
    columns: [
      {
        field: 'title',
        title: 'TASK',
        width: '200',
        headerStyle: { textAlign: 'center', fontSize: 20, fontWeight: 'bold' },
        customLayout: renderTaskCell
      }
    ],
    tableWidth: 'auto'
  },
  frame: {
    outerFrameStyle: { borderLineWidth: 2, borderColor: '#E1E4E8', cornerRadius: 8 }
  },
  grid: {
    horizontalLine: { lineWidth: 2, lineColor: '#d5d9ee' }
  },
  headerRowHeight: 60,
  rowHeight: 80,
  taskBar: {
    startDateField: 'start',
    endDateField: 'end',
    progressField: 'progress',
    barStyle: { width: 60 },
    customLayout: renderTaskBar,
    hoverBarStyle: { cornerRadius: 30 }
  },
  timelineHeader: {
    backgroundColor: '#f0f0fb',
    colWidth: 80,
    scales: [
      {
        unit: 'day',
        step: 1,
        format: dayIndexLabel,
        customLayout: renderDateCell
      }
    ]
  },
  minDate: '2024-07-20',
  maxDate: '2024-08-15',
  markLine: [
    { content: '', date: '2024-07-29', style: { lineWidth: 1, lineColor: 'blue', lineDash: [8, 4] } },
    { content: '', date: '2024-08-17', style: { lineWidth: 2, lineColor: 'red', lineDash: [8, 4] } }
  ],
  scrollStyle: {
    scrollRailColor: 'RGBA(246,246,246,0.5)',
    visible: 'focus',
    width: 6,
    scrollSliderCornerRadius: 2,
    scrollSliderColor: '#5cb85c'
  }
};

/** 时间轴「第 N 周」刻度文案 */
function weekLabel(date: VTableGantt.TYPES.DateFormatArgumentType): string {
  return `Week ${date.dateIndex}`;
}

/** 时间轴日刻度文案（默认就是日期序号） */
function dayIndexLabel(date: VTableGantt.TYPES.DateFormatArgumentType): string {
  return date.dateIndex.toString();
}

/** 自定义任务单元格：头像色块 + 开发者 + 起止日期 */
function renderTaskCell(args: VTableTypes.CustomRenderFunctionArg): VTableTypes.ICustomLayoutObj {
  const { table, row, col, rect } = args;
  const taskRecord = table.getCellOriginRecord(col, row);
  const { height, width } = rect ?? table.getCellRect(col, row);

  const container = new VTableGantt.VRender.Group({
    y: 10,
    x: 20,
    height: height - 20,
    width: width - 40,
    fill: '#ddd',
    display: 'flex',
    flexDirection: 'column',
    cornerRadius: 30
  });

  container.createOrUpdateChild(
    'developer',
    {
      text: String(readField(taskRecord, 'developer')),
      fontSize: 16,
      fontFamily: 'sans-serif',
      fill: barColors[args.row % barColors.length],
      fontWeight: 'bold',
      maxLineWidth: width - 120,
      boundsPadding: [10, 0, 0, 0],
      alignSelf: 'center'
    },
    'text'
  );

  container.createOrUpdateChild(
    'range',
    {
      text: `${formatDay(readField(taskRecord, 'start'))}-${formatDay(readField(taskRecord, 'end'))}`,
      fontSize: 12,
      fontFamily: 'sans-serif',
      fontWeight: 'bold',
      fill: 'black',
      boundsPadding: [10, 0, 0, 0],
      alignSelf: 'center'
    },
    'text'
  );

  return { rootContainer: container };
}

/** 自定义任务条：渐变底 + 头像 + 开发者 + 天数 + 进度 */
function renderTaskBar(
  args: VTableGantt.TYPES.TaskBarCustomLayoutArgumentType
): VTableGantt.TYPES.ITaskBarCustomLayoutObj {
  const colorLength = barColors.length;
  const { width, height, index, taskDays, progress, taskRecord } = args;

  const container = new VTableGantt.VRender.Group({
    width,
    height,
    cornerRadius: 30,
    fill: {
      gradient: 'linear',
      x0: 0,
      y0: 0,
      x1: 1,
      y1: 0,
      stops: [
        { offset: 0, color: barColors0[index % colorLength] },
        { offset: 0.5, color: barColors[index % colorLength] },
        { offset: 1, color: barColors0[index % colorLength] }
      ]
    },
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap'
  });

  const containerLeft = container.createOrUpdateChild(
    'left',
    {
      height,
      width: 60,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-around'
    },
    'group'
  );
  containerLeft.createOrUpdateChild(
    'avatar',
    {
      width: 50,
      height: 50,
      image: String(readField(taskRecord, 'avatar')),
      cornerRadius: 25
    },
    'image'
  );

  const containerCenter = container.createOrUpdateChild(
    'center',
    {
      height,
      width: width - 120,
      display: 'flex',
      flexDirection: 'column'
    },
    'group'
  );
  containerCenter.createOrUpdateChild(
    'developer',
    {
      text: String(readField(taskRecord, 'developer')),
      fontSize: 16,
      fontFamily: 'sans-serif',
      fill: 'white',
      fontWeight: 'bold',
      maxLineWidth: width - 120,
      boundsPadding: [10, 0, 0, 0]
    },
    'text'
  );
  containerCenter.createOrUpdateChild(
    'days',
    {
      text: `${taskDays}天`,
      fontSize: 13,
      fontFamily: 'sans-serif',
      fill: 'white',
      boundsPadding: [10, 0, 0, 0]
    },
    'text'
  );

  if (width >= 120) {
    const containerRight = container.createOrUpdateChild(
      'right',
      {
        cornerRadius: 20,
        fill: 'white',
        height: 40,
        width: 40,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boundsPadding: [10, 0, 0, 0]
      },
      'group'
    );
    containerRight.createOrUpdateChild(
      'progress',
      {
        text: `${progress}%`,
        fontSize: 12,
        fontFamily: 'sans-serif',
        fill: 'black',
        alignSelf: 'center',
        fontWeight: 'bold',
        maxLineWidth: (width - 60) / 2
      },
      'text'
    );
  }

  return { rootContainer: container };
}

/** 自定义时间轴表头：日历图标 + 日期序号 + 星期缩写 */
function renderDateCell(args: VTableGantt.TYPES.DateCustomLayoutArgumentType): VTableGantt.TYPES.IDateCustomLayoutObj {
  const { width, height, startDate, dateIndex } = args;

  const container = new VTableGantt.VRender.Group({
    width,
    height,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap'
  });

  const containerLeft = container.createOrUpdateChild(
    'left',
    {
      height,
      width: 30,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-around'
    },
    'group'
  );
  containerLeft.createOrUpdateChild('icon', { width: 20, height: 30, image: CALENDAR_ICON }, 'image');

  const containerCenter = container.createOrUpdateChild(
    'center',
    {
      height,
      width: width - 30,
      display: 'flex',
      flexDirection: 'column'
    },
    'group'
  );
  containerCenter.createOrUpdateChild(
    'day',
    {
      text: String(dateIndex).padStart(2, '0'),
      fontSize: 20,
      fontWeight: 'bold',
      fontFamily: 'sans-serif',
      fill: '#777',
      textAlign: 'right',
      maxLineWidth: width - 30,
      boundsPadding: [15, 0, 0, 0]
    },
    'text'
  );
  containerCenter.createOrUpdateChild(
    'weekday',
    {
      text: VTableGantt.tools.getWeekday(startDate, 'short').toLocaleUpperCase(),
      fontSize: 12,
      fontFamily: 'sans-serif',
      fill: '#777'
    },
    'text'
  );

  return { rootContainer: container };
}

/** 从单元格原始记录里读一个字段（`getCellOriginRecord` 的返回类型是 `any | undefined`） */
function readField(record: unknown, key: string): unknown {
  if (typeof record !== 'object' || record === null) return undefined;

  const value: unknown = Reflect.get(record, key);

  return value;
}

/** 把任务记录里的日期字段格式化成 `mm/dd` */
function formatDay(value: unknown): string {
  const date = value instanceof Date ? value : new Date(String(value));

  return VTableGantt.tools.formatDate(date, 'mm/dd');
}

const basicGanttDomRef = useTemplateRef<HTMLElement>('basicGanttDomRef');
const linkGanttDomRef = useTemplateRef<HTMLElement>('linkGanttDomRef');
const customGanttDomRef = useTemplateRef<HTMLElement>('customGanttDomRef');

const { t } = useI18n();
const { effectiveMode } = useTheme();

const isDark = computed(() => effectiveMode.value === 'dark');

/** 「更多 Gantt 示例」的外部链接 */
const docLinks = [{ label: 'VisActor VTable Gantt', href: 'https://www.visactor.com/vtable/example' }];

/** 主题切换要重建实例，所以每次 `new Gantt` 前都从原始 option 复制一份 */
const basicGanttInstance = shallowRef<VTableGantt.Gantt>();
const linkGanttInstance = shallowRef<VTableGantt.Gantt>();
const customGanttInstance = shallowRef<VTableGantt.Gantt>();

/** 按当前明暗模式补主题字段，返回新对象（不原地改模块级常量） */
function themedOption(
  option: VTableGantt.GanttConstructorOptions,
  dark: boolean,
  theme: VTableTheme
): VTableGantt.GanttConstructorOptions {
  return {
    ...option,
    taskListTable: { ...option.taskListTable, theme },
    timelineHeader: { ...option.timelineHeader, backgroundColor: dark ? '#212121' : '#f0f0fb' },
    underlayBackgroundColor: dark ? '#000' : '#fff',
    rowSeriesNumber: { title: t('plugin.ganttRowNumber'), dragOrder: true }
  };
}

/** 释放旧实例并重建三个甘特图 */
function initGantt() {
  basicGanttInstance.value?.release();
  linkGanttInstance.value?.release();
  customGanttInstance.value?.release();

  const dark = isDark.value;
  const theme = dark ? VTableGantt.VTable.themes.DARK : VTableGantt.VTable.themes.DEFAULT;
  const basicEl = basicGanttDomRef.value;
  const linkEl = linkGanttDomRef.value;
  const customEl = customGanttDomRef.value;

  if (basicEl) basicGanttInstance.value = new VTableGantt.Gantt(basicEl, themedOption(basicGanttOption, dark, theme));
  if (linkEl) linkGanttInstance.value = new VTableGantt.Gantt(linkEl, themedOption(linkGanttOption, dark, theme));
  if (customEl) {
    customGanttInstance.value = new VTableGantt.Gantt(customEl, themedOption(customGanttOption, dark, theme));
  }
}

/** 三个甘特图释放后再重建（`Gantt.release()` 会清掉自己挂的 DOM） */
function destroyGantt() {
  basicGanttInstance.value?.release();
  linkGanttInstance.value?.release();
  customGanttInstance.value?.release();
  basicGanttInstance.value = undefined;
  linkGanttInstance.value = undefined;
  customGanttInstance.value = undefined;
}

const stopThemeWatch = watch(isDark, initGantt);

onMounted(initGantt);

onUnmounted(() => {
  stopThemeWatch();
  destroyGantt();
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <SCard :title="t('plugin.vtableGantt')">
      <PluginDocLinks :links="docLinks" />
    </SCard>

    <SCard :title="t('plugin.ganttBasic')">
      <div ref="basicGanttDomRef" class="relative h-400px" />
    </SCard>

    <SCard :title="t('plugin.ganttLink')">
      <div ref="linkGanttDomRef" class="relative h-400px" />
    </SCard>

    <SCard :title="t('plugin.ganttCustom')">
      <div ref="customGanttDomRef" class="relative h-400px" />
    </SCard>
  </div>
</template>
