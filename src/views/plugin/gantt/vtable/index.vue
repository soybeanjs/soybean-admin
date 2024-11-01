<script setup lang="tsx">
import { onMounted, onUnmounted, shallowRef, watch } from 'vue';
import * as VTableGantt from '@visactor/vtable-gantt';
import * as VTable_editors from '@visactor/vtable-editors';
import { useThemeStore } from '@/store/modules/theme';
import { basicGanttRecords, customGanttRecords, linkGanttRecords } from './data';

const theme = useThemeStore();

const input_editor = new VTable_editors.InputEditor();
const date_input_editor = new VTable_editors.DateInputEditor();
VTableGantt.VTable.register.editor('input', input_editor);
VTableGantt.VTable.register.editor('date-input', date_input_editor);

const basicGanttDomRef = shallowRef<HTMLElement>();
const linkGanttDomRef = shallowRef<HTMLElement>();
const customGanttDomRef = shallowRef<HTMLElement>();

const basicGanttInstance = shallowRef<VTableGantt.Gantt>();
const linkGanttInstance = shallowRef<VTableGantt.Gantt>();
const customGanttInstance = shallowRef<VTableGantt.Gantt>();

const basicGanttColumns = [
  {
    field: 'title',
    title: 'title',
    width: 'auto',
    sort: true,
    tree: true,
    editor: 'input'
  },
  {
    field: 'start',
    title: 'start',
    width: 'auto',
    sort: true,
    editor: 'date-input'
  },
  {
    field: 'end',
    title: 'end',
    width: 'auto',
    sort: true,
    editor: 'date-input'
  },
  {
    field: 'priority',
    title: 'priority',
    width: 'auto',
    sort: true,
    editor: 'input'
  },
  {
    field: 'progress',
    title: 'progress',
    width: 'auto',
    sort: true,
    headerStyle: {
      borderColor: '#e1e4e8'
    },
    style: {
      borderColor: '#e1e4e8',
      color: 'green'
    },
    editor: 'input'
  }
];
const basicGanttOption: VTableGantt.GanttConstructorOptions = {
  overscrollBehavior: 'none',
  records: basicGanttRecords,
  taskListTable: {
    columns: basicGanttColumns,
    tableWidth: 250,
    minTableWidth: 100,
    maxTableWidth: 600
    // rightFrozenColCount: 1
  },
  frame: {
    outerFrameStyle: {
      borderLineWidth: 2,
      borderColor: '#e1e4e8',
      cornerRadius: 8
    },
    verticalSplitLine: {
      lineColor: '#e1e4e8',
      lineWidth: 3
    },
    horizontalSplitLine: {
      lineColor: '#e1e4e8',
      lineWidth: 3
    },
    verticalSplitLineMoveable: true,
    verticalSplitLineHighlight: {
      lineColor: 'green',
      lineWidth: 3
    }
  },
  grid: {
    // backgroundColor: 'gray',
    verticalLine: {
      lineWidth: 1,
      lineColor: '#e1e4e8'
    },
    horizontalLine: {
      lineWidth: 1,
      lineColor: '#e1e4e8'
    }
  },
  headerRowHeight: 40,
  rowHeight: 40,
  taskBar: {
    startDateField: 'start',
    endDateField: 'end',
    progressField: 'progress',
    // resizable: false,
    moveable: true,
    hoverBarStyle: {
      barOverlayColor: 'rgba(99, 144, 0, 0.4)'
    },
    labelText: '{title} {progress}%',
    labelTextStyle: {
      // padding: 2,
      fontFamily: 'Arial',
      fontSize: 16,
      textAlign: 'left',
      textOverflow: 'ellipsis'
    },
    barStyle: {
      width: 20,
      /** 任务条的颜色 */
      barColor: '#ee8800',
      /** 已完成部分任务条的颜色 */
      completedBarColor: '#91e8e0',
      /** 任务条的圆角 */
      cornerRadius: 8
    }
  },
  timelineHeader: {
    colWidth: 100,
    backgroundColor: '#EEF1F5',
    horizontalLine: {
      lineWidth: 1,
      lineColor: '#e1e4e8'
    },
    verticalLine: {
      lineWidth: 1,
      lineColor: '#e1e4e8'
    },
    scales: [
      {
        unit: 'week',
        step: 1,
        startOfWeek: 'sunday',
        format(date: any) {
          return `Week ${date.dateIndex}`;
        },
        style: {
          fontSize: 20,
          fontWeight: 'bold',
          color: 'white',
          strokeColor: 'black',
          textAlign: 'right',
          textBaseline: 'bottom',
          textStick: true
          // padding: [0, 30, 0, 20]
        }
      },
      {
        unit: 'day',
        step: 1,
        format(date: any) {
          return date.dateIndex.toString();
        },
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
    {
      date: '2024-07-28',
      style: {
        lineWidth: 1,
        lineColor: 'blue',
        lineDash: [8, 4]
      }
    },
    {
      date: '2024-08-17',
      style: {
        lineWidth: 2,
        lineColor: 'red',
        lineDash: [8, 4]
      }
    }
  ],
  rowSeriesNumber: {
    title: '行号',
    dragOrder: true
  },
  scrollStyle: {
    scrollRailColor: 'RGBA(246,246,246,0.5)',
    visible: 'scrolling',
    width: 6,
    scrollSliderCornerRadius: 2,
    scrollSliderColor: '#5cb85c'
  }
};

const linkGanttColumns = [
  {
    field: 'title',
    title: 'title',
    width: 'auto',
    tree: true
  },
  {
    field: 'start',
    title: 'start',
    width: 'auto',
    editor: 'date-input'
  },
  {
    field: 'end',
    title: 'end',
    width: 'auto',
    editor: 'date-input'
  },
  {
    field: 'priority',
    title: 'priority',
    width: 'auto',
    editor: 'input'
  },
  {
    field: 'progress',
    title: 'progress',
    width: 'auto',
    headerStyle: {
      borderColor: '#e1e4e8'
    },
    style: {
      borderColor: '#e1e4e8',
      color: 'green'
    },
    editor: 'input'
  }
];
const linkGanttOption: VTableGantt.GanttConstructorOptions = {
  records: linkGanttRecords,
  taskListTable: {
    columns: linkGanttColumns,
    tableWidth: 400,
    minTableWidth: 100,
    maxTableWidth: 600
  },
  dependency: {
    links: [
      {
        type: VTableGantt.TYPES.DependencyType.FinishToStart,
        linkedFromTaskKey: 1,
        linkedToTaskKey: 2
      },
      {
        type: VTableGantt.TYPES.DependencyType.StartToFinish,
        linkedFromTaskKey: 2,
        linkedToTaskKey: 3
      },
      {
        type: VTableGantt.TYPES.DependencyType.StartToStart,
        linkedFromTaskKey: 3,
        linkedToTaskKey: 4
      },
      {
        type: VTableGantt.TYPES.DependencyType.FinishToFinish,
        linkedFromTaskKey: 4,
        linkedToTaskKey: 5
      }
    ],
    // linkSelectable: false,
    linkSelectedLineStyle: {
      shadowBlur: 5, // 阴影宽度
      shadowColor: 'red',
      lineColor: 'red',
      lineWidth: 1
    }
  },
  frame: {
    verticalSplitLineMoveable: true,
    outerFrameStyle: {
      borderLineWidth: 2,
      // borderColor: 'red',
      cornerRadius: 8
    },
    verticalSplitLine: {
      lineWidth: 3,
      lineColor: '#e1e4e8'
    },
    verticalSplitLineHighlight: {
      lineColor: 'green',
      lineWidth: 3
    }
  },
  grid: {
    // backgroundColor: 'gray',
    verticalLine: {
      lineWidth: 1,
      lineColor: '#e1e4e8'
    },
    horizontalLine: {
      lineWidth: 1,
      lineColor: '#e1e4e8'
    }
  },
  headerRowHeight: 60,
  rowHeight: 40,

  taskBar: {
    startDateField: 'start',
    endDateField: 'end',
    progressField: 'progress',
    labelText: '{title} {progress}%',
    labelTextStyle: {
      fontFamily: 'Arial',
      fontSize: 16,
      textAlign: 'left'
    },
    barStyle: {
      width: 20,
      /** 任务条的颜色 */
      barColor: '#ee8800',
      /** 已完成部分任务条的颜色 */
      completedBarColor: '#91e8e0',
      /** 任务条的圆角 */
      cornerRadius: 10
    },
    selectedBarStyle: {
      shadowBlur: 5, // 阴影宽度
      shadowOffsetX: 0, // x方向偏移
      shadowOffsetY: 0, // Y方向偏移
      shadowColor: 'black', // 阴影颜色
      borderColor: 'red', // 边框颜色
      borderLineWidth: 1 // 边框宽度
    }
  },
  timelineHeader: {
    verticalLine: {
      lineWidth: 1,
      lineColor: '#e1e4e8'
    },
    horizontalLine: {
      lineWidth: 1,
      lineColor: '#e1e4e8'
    },
    backgroundColor: '#EEF1F5',
    colWidth: 60,
    scales: [
      {
        unit: 'week',
        step: 1,
        startOfWeek: 'sunday',
        format(date: any) {
          return `Week ${date.dateIndex}`;
        },
        style: {
          fontSize: 20,
          fontWeight: 'bold',
          color: 'red'
        }
      },
      {
        unit: 'day',
        step: 1,
        format(date: any) {
          return date.dateIndex.toString();
        },
        style: {
          fontSize: 20,
          fontWeight: 'bold',
          color: 'red'
        }
      }
    ]
  },
  minDate: '2024-07-14',
  maxDate: '2024-10-15',

  rowSeriesNumber: {
    title: '行号',
    dragOrder: true
  },
  scrollStyle: {
    visible: 'scrolling'
  },
  overscrollBehavior: 'none'
};

const barColors0 = ['#aecde6', '#c6a49a', '#ffb582', '#eec1de', '#b3d9b3', '#cccccc', '#e59a9c', '#d9d1a5', '#c9bede'];
const barColors = ['#1f77b4', '#8c564b', '#ff7f0e', '#e377c2', '#2ca02c', '#7f7f7f', '#d62728', '#bcbd22', '#9467bd'];
const customGanttColumns: VTableGantt.ColumnsDefine = [
  {
    field: 'title',
    title: 'TASK',
    width: '200',
    headerStyle: {
      textAlign: 'center',
      fontSize: 20,
      fontWeight: 'bold'
      // color: 'black',
      // bgColor: '#f0f0fb'
    },
    style: {
      // bgColor: '#f0f0fb'
    },
    customLayout: (args: any) => {
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

      const developer = new VTableGantt.VRender.Text({
        text: taskRecord.developer,
        fontSize: 16,
        fontFamily: 'sans-serif',
        fill: barColors[args.row],
        fontWeight: 'bold',
        maxLineWidth: width - 120,
        boundsPadding: [10, 0, 0, 0],
        alignSelf: 'center'
      });
      container.add(developer);

      const days = new VTableGantt.VRender.Text({
        text: `${VTableGantt.tools.formatDate(new Date(taskRecord.start), 'mm/dd')}-${VTableGantt.tools.formatDate(
          new Date(taskRecord.end),
          'mm/dd'
        )}`,
        fontSize: 12,
        fontFamily: 'sans-serif',
        fontWeight: 'bold',
        fill: 'black',
        boundsPadding: [10, 0, 0, 0],
        alignSelf: 'center'
      });
      container.add(days);

      return {
        rootContainer: container,
        expectedWidth: 160
      };
    }
  }
];
const customGanttOption: VTableGantt.GanttConstructorOptions = {
  records: customGanttRecords,
  taskListTable: {
    columns: customGanttColumns,
    tableWidth: 'auto'
  },
  frame: {
    outerFrameStyle: {
      borderLineWidth: 2,
      borderColor: '#E1E4E8',
      cornerRadius: 8
    }
    // verticalSplitLineHighlight: {
    //   lineColor: 'green',
    //   lineWidth: 3
    // }
  },
  grid: {
    // backgroundColor: '#f0f0fb',
    // vertical: {
    //   lineWidth: 1,
    //   lineColor: '#e1e4e8'
    // },
    horizontalLine: {
      lineWidth: 2,
      lineColor: '#d5d9ee'
    }
  },
  headerRowHeight: 60,
  rowHeight: 80,
  taskBar: {
    startDateField: 'start',
    endDateField: 'end',
    progressField: 'progress',
    barStyle: { width: 60 },
    customLayout: (args: any) => {
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
            {
              offset: 0,
              color: barColors0[index % colorLength]
            },
            {
              offset: 0.5,
              color: barColors[index % colorLength]
            },
            {
              offset: 1,
              color: barColors0[index % colorLength]
            }
          ]
        },
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap'
      });
      const containerLeft = new VTableGantt.VRender.Group({
        height,
        width: 60,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around'
        // fill: 'red'
      });
      container.add(containerLeft as any);

      const avatar = new VTableGantt.VRender.Image({
        width: 50,
        height: 50,
        image: taskRecord.avatar,
        cornerRadius: 25
      });
      containerLeft.add(avatar);
      const containerCenter = new VTableGantt.VRender.Group({
        height,
        width: width - 120,
        display: 'flex',
        flexDirection: 'column'
        // alignItems: 'left'
      });
      container.add(containerCenter as any);

      const developer = new VTableGantt.VRender.Text({
        text: taskRecord.developer,
        fontSize: 16,
        fontFamily: 'sans-serif',
        fill: 'white',
        fontWeight: 'bold',
        maxLineWidth: width - 120,
        boundsPadding: [10, 0, 0, 0]
      });
      containerCenter.add(developer);

      const days = new VTableGantt.VRender.Text({
        text: `${taskDays}天`,
        fontSize: 13,
        fontFamily: 'sans-serif',
        fill: 'white',
        boundsPadding: [10, 0, 0, 0]
      });
      containerCenter.add(days);

      if (width >= 120) {
        const containerRight = new VTableGantt.VRender.Group({
          cornerRadius: 20,
          fill: 'white',
          height: 40,
          width: 40,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center', // 垂直方向居中对齐
          boundsPadding: [10, 0, 0, 0]
        });
        container.add(containerRight as any);

        const progressText = new VTableGantt.VRender.Text({
          text: `${progress}%`,
          fontSize: 12,
          fontFamily: 'sans-serif',
          fill: 'black',
          alignSelf: 'center',
          fontWeight: 'bold',
          maxLineWidth: (width - 60) / 2,
          boundsPadding: [0, 0, 0, 0]
        });
        containerRight.add(progressText);
      }
      return {
        rootContainer: container
        // renderDefaultBar: true
        // renderDefaultText: true
      };
    },
    hoverBarStyle: {
      cornerRadius: 30
    }
  },
  timelineHeader: {
    backgroundColor: '#f0f0fb',
    colWidth: 80,
    // verticalLine: {
    //   lineColor: 'red',
    //   lineWidth: 1,
    //   lineDash: [4, 2]
    // },
    // horizontalLine: {
    //   lineColor: 'green',
    //   lineWidth: 1,
    //   lineDash: [4, 2]
    // },
    scales: [
      {
        unit: 'day',
        step: 1,
        format(date: any) {
          return date.dateIndex.toString();
        },
        customLayout: (args: any) => {
          const { width, height, startDate, dateIndex } = args;
          const container = new VTableGantt.VRender.Group({
            width,
            height,
            // fill: '#f0f0fb',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap'
          });
          const containerLeft = new VTableGantt.VRender.Group({
            height,
            width: 30,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-around'
            // fill: 'red'
          });
          container.add(containerLeft as any);

          const avatar = new VTableGantt.VRender.Image({
            width: 20,
            height: 30,
            image:
              '<svg t="1724675965803" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4299" width="200" height="200"><path d="M53.085678 141.319468C23.790257 141.319468 0 165.035326 0 194.34775L0 918.084273C0 947.295126 23.796789 971.112572 53.085678 971.112572L970.914322 971.112572C1000.209743 971.112572 1024 947.396696 1024 918.084273L1024 194.34775C1024 165.136896 1000.203211 141.319468 970.914322 141.319468L776.827586 141.319468 812.137931 176.629813 812.137931 88.275862C812.137931 68.774506 796.328942 52.965517 776.827586 52.965517 757.32623 52.965517 741.517241 68.774506 741.517241 88.275862L741.517241 176.629813 741.517241 211.940158 776.827586 211.940158 970.914322 211.940158C961.186763 211.940158 953.37931 204.125926 953.37931 194.34775L953.37931 918.084273C953.37931 908.344373 961.25643 900.491882 970.914322 900.491882L53.085678 900.491882C62.813237 900.491882 70.62069 908.306097 70.62069 918.084273L70.62069 194.34775C70.62069 204.087649 62.74357 211.940158 53.085678 211.940158L247.172414 211.940158C266.67377 211.940158 282.482759 196.131169 282.482759 176.629813 282.482759 157.128439 266.67377 141.319468 247.172414 141.319468L53.085678 141.319468ZM211.862069 176.629813C211.862069 196.131169 227.671058 211.940158 247.172414 211.940158 266.67377 211.940158 282.482759 196.131169 282.482759 176.629813L282.482759 88.275862C282.482759 68.774506 266.67377 52.965517 247.172414 52.965517 227.671058 52.965517 211.862069 68.774506 211.862069 88.275862L211.862069 176.629813ZM1024 353.181537 1024 317.871192 988.689655 317.871192 35.310345 317.871192 0 317.871192 0 353.181537 0 441.457399C0 460.958755 15.808989 476.767744 35.310345 476.767744 54.811701 476.767744 70.62069 460.958755 70.62069 441.457399L70.62069 353.181537 35.310345 388.491882 988.689655 388.491882 953.37931 353.181537 953.37931 441.457399C953.37931 460.958755 969.188299 476.767744 988.689655 476.767744 1008.191011 476.767744 1024 460.958755 1024 441.457399L1024 353.181537ZM776.937913 582.62069C796.439287 582.62069 812.248258 566.811701 812.248258 547.310345 812.248258 527.808989 796.439287 512 776.937913 512L247.172414 512C227.671058 512 211.862069 527.808989 211.862069 547.310345 211.862069 566.811701 227.671058 582.62069 247.172414 582.62069L776.937913 582.62069ZM247.172414 688.551724C227.671058 688.551724 211.862069 704.360713 211.862069 723.862069 211.862069 743.363425 227.671058 759.172414 247.172414 759.172414L600.386189 759.172414C619.887563 759.172414 635.696534 743.363425 635.696534 723.862069 635.696534 704.360713 619.887563 688.551724 600.386189 688.551724L247.172414 688.551724ZM776.827586 211.940158 741.517241 176.629813 741.517241 247.328574C741.517241 266.829948 757.32623 282.638919 776.827586 282.638919 796.328942 282.638919 812.137931 266.829948 812.137931 247.328574L812.137931 176.629813 812.137931 141.319468 776.827586 141.319468 247.172414 141.319468C227.671058 141.319468 211.862069 157.128439 211.862069 176.629813 211.862069 196.131169 227.671058 211.940158 247.172414 211.940158L776.827586 211.940158ZM282.482759 176.629813C282.482759 157.128439 266.67377 141.319468 247.172414 141.319468 227.671058 141.319468 211.862069 157.128439 211.862069 176.629813L211.862069 247.328574C211.862069 266.829948 227.671058 282.638919 247.172414 282.638919 266.67377 282.638919 282.482759 266.829948 282.482759 247.328574L282.482759 176.629813Z" fill="#389BFF" p-id="4300"></path></svg>'
          });
          containerLeft.add(avatar);

          const containerCenter = new VTableGantt.VRender.Group({
            height,
            width: width - 30,
            display: 'flex',
            flexDirection: 'column'
            // alignItems: 'left'
          });
          container.add(containerCenter as any);
          const dayNumber = new VTableGantt.VRender.Text({
            text: String(dateIndex).padStart(2, '0'),
            fontSize: 20,
            fontWeight: 'bold',
            fontFamily: 'sans-serif',
            fill: '#777',
            textAlign: 'right',
            maxLineWidth: width - 30,
            boundsPadding: [15, 0, 0, 0]
          });
          containerCenter.add(dayNumber);

          const weekDay = new VTableGantt.VRender.Text({
            text: VTableGantt.tools.getWeekday(startDate, 'short').toLocaleUpperCase(),
            fontSize: 12,
            fontFamily: 'sans-serif',
            fill: '#777',
            boundsPadding: [0, 0, 0, 0]
          });
          containerCenter.add(weekDay);
          return {
            rootContainer: container
            // renderDefaultText: true
          };
        }
      }
    ]
  },
  minDate: '2024-07-20',
  maxDate: '2024-08-15',
  markLine: [
    {
      date: '2024-07-29',
      style: {
        lineWidth: 1,
        lineColor: 'blue',
        lineDash: [8, 4]
      }
    },
    {
      date: '2024-08-17',
      style: {
        lineWidth: 2,
        lineColor: 'red',
        lineDash: [8, 4]
      }
    }
  ],
  scrollStyle: {
    scrollRailColor: 'RGBA(246,246,246,0.5)',
    visible: 'focus',
    width: 6,
    scrollSliderCornerRadius: 2,
    scrollSliderColor: '#5cb85c'
  }
};

function initVTableGantt() {
  basicGanttInstance.value = new VTableGantt.Gantt(basicGanttDomRef.value as HTMLElement, getOption(basicGanttOption));
  linkGanttInstance.value = new VTableGantt.Gantt(linkGanttDomRef.value as HTMLElement, getOption(linkGanttOption));
  customGanttInstance.value = new VTableGantt.Gantt(
    customGanttDomRef.value as HTMLElement,
    getOption(customGanttOption)
  );
}

function getOption(option: VTableGantt.GanttConstructorOptions) {
  const isDark = theme.darkMode;
  if (isDark) {
    option.taskListTable!.theme = VTableGantt.VTable.themes.DARK;
    option.timelineHeader.backgroundColor = '#212121';
    option.underlayBackgroundColor = '#000';
  } else {
    option.taskListTable!.theme = VTableGantt.VTable.themes.DEFAULT;
    option.timelineHeader.backgroundColor = '#f0f0fb';
    option.underlayBackgroundColor = '#fff';
  }

  return option;
}

const stopHandle = watch(
  () => theme.darkMode,
  _newValue => {
    basicGanttInstance.value?.release();
    linkGanttInstance.value?.release();
    customGanttInstance.value?.release();

    initVTableGantt();
  }
);

onMounted(() => {
  initVTableGantt();
});

onUnmounted(() => {
  stopHandle();
});
</script>

<template>
  <NSpace vertical :size="16">
    <NCard :bordered="false" title="VTableGantt" class="h-full card-wrapper">
      <WebSiteLink label="More Demos: " link="https://www.visactor.com/vtable/example" />
    </NCard>
    <NCard :bordered="false" class="h-full card-wrapper">
      <div ref="basicGanttDomRef" class="relative h-400px"></div>
    </NCard>
    <NCard :bordered="false" class="h-full card-wrapper">
      <div ref="linkGanttDomRef" class="relative h-400px"></div>
    </NCard>
    <NCard :bordered="false" class="h-full card-wrapper">
      <div ref="customGanttDomRef" class="relative h-400px"></div>
    </NCard>
  </NSpace>
</template>
