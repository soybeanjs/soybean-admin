import type {
  IAreaChartSpec,
  IBarChartSpec,
  ICircularProgressChartSpec,
  IHistogramChartSpec,
  IIndicatorSpec,
  ILiquidChartSpec,
  IWordCloudChartSpec
} from '@visactor/vchart';
import type { IAnimationConfig } from '@visactor/vgrammar-core';

export const shapeWordCloudSpec: IWordCloudChartSpec = {
  type: 'wordCloud',
  maskShape: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/log.jpeg',
  nameField: 'challenge_name',
  valueField: 'sum_count',
  seriesField: 'challenge_name',
  data: [
    {
      name: 'data',
      values: [
        {
          challenge_name: '刘浩存',
          sum_count: 957
        },
        {
          challenge_name: '刘昊然',
          sum_count: 942
        },
        {
          challenge_name: '喜欢',
          sum_count: 842
        },
        {
          challenge_name: '真的',
          sum_count: 828
        },
        {
          challenge_name: '四海',
          sum_count: 665
        },
        {
          challenge_name: '好看',
          sum_count: 627
        },
        {
          challenge_name: '评论',
          sum_count: 574
        },
        {
          challenge_name: '好像',
          sum_count: 564
        },
        {
          challenge_name: '沈腾',
          sum_count: 554
        },
        {
          challenge_name: '不像',
          sum_count: 540
        },
        {
          challenge_name: '多少钱',
          sum_count: 513
        },
        {
          challenge_name: '韩寒',
          sum_count: 513
        },
        {
          challenge_name: '不知道',
          sum_count: 499
        },
        {
          challenge_name: '感觉',
          sum_count: 499
        },
        {
          challenge_name: '尹正',
          sum_count: 495
        },
        {
          challenge_name: '不看',
          sum_count: 487
        },
        {
          challenge_name: '奥特之父',
          sum_count: 484
        },
        {
          challenge_name: '阿姨',
          sum_count: 482
        },
        {
          challenge_name: '支持',
          sum_count: 482
        },
        {
          challenge_name: '父母',
          sum_count: 479
        },
        {
          challenge_name: '一条',
          sum_count: 462
        },
        {
          challenge_name: '女主',
          sum_count: 456
        },
        {
          challenge_name: '确实',
          sum_count: 456
        },
        {
          challenge_name: '票房',
          sum_count: 456
        },
        {
          challenge_name: '无语',
          sum_count: 443
        },
        {
          challenge_name: '干干净净',
          sum_count: 443
        },
        {
          challenge_name: '为啥',
          sum_count: 426
        },
        {
          challenge_name: '爱情',
          sum_count: 425
        },
        {
          challenge_name: '喜剧',
          sum_count: 422
        },
        {
          challenge_name: '春节',
          sum_count: 414
        },
        {
          challenge_name: '剧情',
          sum_count: 414
        },
        {
          challenge_name: '人生',
          sum_count: 409
        },
        {
          challenge_name: '风格',
          sum_count: 408
        },
        {
          challenge_name: '演员',
          sum_count: 403
        },
        {
          challenge_name: '成长',
          sum_count: 403
        },
        {
          challenge_name: '玩意',
          sum_count: 402
        },
        {
          challenge_name: '文学',
          sum_count: 397
        }
      ]
    }
  ]
};

export const circularProgressTickSpec: ICircularProgressChartSpec & { indicator: IIndicatorSpec } = {
  type: 'circularProgress',
  data: [
    {
      id: 'id0',
      values: [
        {
          type: 'Tradition Industries',
          value: 0.795,
          text: '79.5%'
        },
        {
          type: 'Business Companies',
          value: 0.5,
          text: '50%'
        },
        {
          type: 'Customer-facing Companies',
          value: 0.25,
          text: '25%'
        }
      ]
    }
  ],
  color: ['rgb(255, 222, 0)', 'rgb(171, 205, 5)', 'rgb(0, 154, 68)'],
  valueField: 'value',
  categoryField: 'type',
  seriesField: 'type',
  radius: 0.8,
  innerRadius: 0.4,
  tickMask: {
    visible: true,
    angle: 10,
    offsetAngle: 0,
    forceAlign: true,
    style: {
      cornerRadius: 15
    }
  },
  axes: [
    {
      visible: false,
      type: 'linear',
      orient: 'angle'
    },
    {
      visible: false,
      type: 'band',
      orient: 'radius'
    }
  ],
  indicator: {
    visible: true,
    trigger: 'hover',
    title: {
      visible: true,
      field: 'type',
      autoLimit: true,
      style: {
        fontSize: 20,
        fill: 'black'
      }
    },
    content: [
      {
        visible: true,
        field: 'text',
        style: {
          fontSize: 16,
          fill: 'gray'
        }
      }
    ]
  },
  legends: {
    visible: true,
    orient: 'bottom',
    title: {
      visible: false
    }
  }
};

export const liquidChartSmartInvertSpec: ILiquidChartSpec & { indicator: IIndicatorSpec } = {
  type: 'liquid',
  valueField: 'value',
  data: {
    id: 'data',
    values: [
      {
        value: 0.8
      }
    ]
  },
  maskShape: 'drop', // 水滴
  // maskShape: 'circle',
  // maskShape: 'star',
  indicatorSmartInvert: true,
  indicator: {
    visible: true,
    title: {
      visible: true,
      style: {
        text: '进度'
      }
    },
    content: [
      {
        visible: true,
        style: {
          fill: 'black',
          text: '80%'
        }
      }
    ]
  },
  liquidBackground: {
    style: {
      fill: 'blue'
    }
  }
};

const goldenMedals: Record<number, any[]> = {
  2000: [
    { country: 'USA', value: 37 },
    { country: 'Russia', value: 32 },
    { country: 'China', value: 28 },
    { country: 'Australia', value: 16 },
    { country: 'Germany', value: 13 },
    { country: 'France', value: 13 },
    { country: 'Italy', value: 13 },
    { country: 'Netherlands', value: 12 },
    { country: 'Cuba', value: 11 },
    { country: 'U.K.', value: 11 }
  ],
  2004: [
    { country: 'USA', value: 36 },
    { country: 'China', value: 32 },
    { country: 'Russia', value: 28 },
    { country: 'Australia', value: 17 },
    { country: 'Japan', value: 16 },
    { country: 'Germany', value: 13 },
    { country: 'France', value: 11 },
    { country: 'Italy', value: 10 },
    { country: 'South Korea', value: 9 },
    { country: 'U.K.', value: 9 }
  ],
  2008: [
    { country: 'China', value: 48 },
    { country: 'USA', value: 36 },
    { country: 'Russia', value: 24 },
    { country: 'U.K.', value: 19 },
    { country: 'Germany', value: 16 },
    { country: 'Australia', value: 14 },
    { country: 'South Korea', value: 13 },
    { country: 'Japan', value: 9 },
    { country: 'Italy', value: 8 },
    { country: 'France', value: 7 }
  ],
  2012: [
    { country: 'USA', value: 46 },
    { country: 'China', value: 39 },
    { country: 'U.K.', value: 29 },
    { country: 'Russia', value: 19 },
    { country: 'South Korea', value: 13 },
    { country: 'Germany', value: 11 },
    { country: 'France', value: 11 },
    { country: 'Australia', value: 8 },
    { country: 'Italy', value: 8 },
    { country: 'Hungary', value: 8 }
  ],
  2016: [
    { country: 'USA', value: 46 },
    { country: 'U.K.', value: 27 },
    { country: 'China', value: 26 },
    { country: 'Russia', value: 19 },
    { country: 'Germany', value: 17 },
    { country: 'Japan', value: 12 },
    { country: 'France', value: 10 },
    { country: 'South Korea', value: 9 },
    { country: 'Italy', value: 8 },
    { country: 'Australia', value: 8 }
  ],
  2020: [
    { country: 'USA', value: 39 },
    { country: 'China', value: 38 },
    { country: 'Japan', value: 27 },
    { country: 'U.K.', value: 22 },
    { country: 'Russian Olympic Committee', value: 20 },
    { country: 'Australia', value: 17 },
    { country: 'Netherlands', value: 10 },
    { country: 'France', value: 10 },
    { country: 'Germany', value: 10 },
    { country: 'Italy', value: 10 }
  ]
};

const colors = {
  China: '#d62728',
  USA: '#1664FF',
  Russia: '#B2CFFF',
  'U.K.': '#1AC6FF',
  Australia: '#94EFFF',
  Japan: '#FF8A00',
  Cuba: '#FFCE7A',
  Germany: '#3CC780',
  France: '#B9EDCD',
  Italy: '#7442D4',
  'South Korea': '#DDC5FA',
  'Russian Olympic Committee': '#B2CFFF',
  Netherlands: '#FFC400',
  Hungary: '#FAE878'
};

const dataSpecs = Object.keys(goldenMedals).map(year => {
  return {
    data: [
      {
        id: 'id',
        values: (goldenMedals[year as unknown as number] as any)
          .sort((a: any, b: any) => b.value - a.value)
          .map((v: any) => {
            return { ...v, fill: (colors as any)[v.country] };
          })
      },
      {
        id: 'year',
        values: [{ year }]
      }
    ]
  };
});
const duration = 1000;
const exchangeDuration = 600;

export const rankingBarSpec: IBarChartSpec = {
  type: 'bar',
  padding: {
    top: 12,
    right: 100,
    bottom: 12
  },
  data: dataSpecs[0].data,
  direction: 'horizontal',
  yField: 'country',
  xField: 'value',
  seriesField: 'country',
  bar: {
    style: {
      fill: (datum: any) => datum.fill
    }
  },
  axes: [
    {
      animation: true,
      orient: 'bottom',
      type: 'linear',
      visible: true,
      max: 50,
      grid: {
        visible: true
      }
    },
    {
      animation: true,
      id: 'axis-left',
      orient: 'left',
      width: 130,
      tick: { visible: false },
      label: { visible: true },
      type: 'band'
    }
  ],
  title: {
    visible: true,
    text: 'Top 10 Olympic Gold Medals by Country Since 2000'
  },
  animationUpdate: {
    bar: [
      {
        type: 'update',
        options: { excludeChannels: ['y'] },
        easing: 'linear',
        duration
      },
      {
        channel: ['y'],
        easing: 'circInOut',
        duration: exchangeDuration
      }
    ],
    axis: {
      duration: exchangeDuration,
      easing: 'circInOut'
    }
  } as Record<string, IAnimationConfig>,
  animationEnter: {
    bar: [
      {
        type: 'moveIn',
        duration: exchangeDuration,
        easing: 'circInOut',
        options: {
          direction: 'y',
          orient: 'negative'
        }
      }
    ]
  },
  animationExit: {
    bar: [
      {
        type: 'fadeOut',
        duration: exchangeDuration
      }
    ]
  },
  customMark: [
    {
      type: 'text',
      dataId: 'year',
      style: {
        textBaseline: 'bottom',
        fontSize: 200,
        textAlign: 'right',
        fontFamily: 'PingFang SC',
        fontWeight: 600,
        text: (datum: any) => datum.year,
        x: (_datum: any, ctx: any) => {
          return ctx.vchart.getChart().getCanvasRect()?.width - 50;
        },
        y: (_datum: any, ctx: any) => {
          return ctx.vchart.getChart().getCanvasRect()?.height - 50;
        },
        fill: 'grey',
        fillOpacity: 0.5
      }
    }
  ],
  player: {
    type: 'continuous',
    orient: 'bottom',
    auto: true,
    loop: true,
    dx: 80,
    position: 'middle',
    interval: duration,
    specs: dataSpecs,
    slider: {
      railStyle: {
        height: 6
      }
    },
    controller: {
      backward: {
        style: {
          size: 12
        }
      },
      forward: {
        style: {
          size: 12
        }
      },
      start: {
        order: 1,
        position: 'end'
      }
    }
  }
};

export const stackedDashAreaSpec: IAreaChartSpec = {
  type: 'area',
  data: {
    values: [
      { month: 'Jan', country: 'Africa', value: 4229 },
      { month: 'Jan', country: 'EU', value: 4376 },
      { month: 'Jan', country: 'China', value: 3054 },
      { month: 'Jan', country: 'USA', value: 12814 },
      { month: 'Feb', country: 'Africa', value: 3932 },
      { month: 'Feb', country: 'EU', value: 3987 },
      { month: 'Feb', country: 'China', value: 5067 },
      { month: 'Feb', country: 'USA', value: 13012 },
      { month: 'Mar', country: 'Africa', value: 5221 },
      { month: 'Mar', country: 'EU', value: 3574 },
      { month: 'Mar', country: 'China', value: 7004 },
      { month: 'Mar', country: 'USA', value: 11624 },
      { month: 'Apr', country: 'Africa', value: 9256 },
      { month: 'Apr', country: 'EU', value: 4376 },
      { month: 'Apr', country: 'China', value: 9054 },
      { month: 'Apr', country: 'USA', value: 8814 },
      { month: 'May', country: 'Africa', value: 3308 },
      { month: 'May', country: 'EU', value: 4572 },
      { month: 'May', country: 'China', value: 12043 },
      { month: 'May', country: 'USA', value: 12998 },
      { month: 'Jun', country: 'Africa', value: 5432 },
      { month: 'Jun', country: 'EU', value: 3417 },
      { month: 'Jun', country: 'China', value: 15067 },
      { month: 'Jun', country: 'USA', value: 12321 },
      { month: 'Jul', country: 'Africa', value: 13701 },
      { month: 'Jul', country: 'EU', value: 5231 },
      { month: 'Jul', country: 'China', value: 10119 },
      { month: 'Jul', country: 'USA', value: 10342 },
      { month: 'Aug', country: 'Africa', value: 4008, forecast: true },
      { month: 'Aug', country: 'EU', value: 4572, forecast: true },
      { month: 'Aug', country: 'China', value: 12043, forecast: true },
      { month: 'Aug', country: 'USA', value: 22998, forecast: true },
      { month: 'Sept', country: 'Africa', value: 18712, forecast: true },
      { month: 'Sept', country: 'EU', value: 6134, forecast: true },
      { month: 'Sept', country: 'China', value: 10419, forecast: true },
      { month: 'Sept', country: 'USA', value: 11261, forecast: true }
    ]
  },
  stack: true,
  xField: 'month',
  yField: 'value',
  seriesField: 'country',
  point: {
    style: {
      size: 0
    },
    state: {
      dimension_hover: {
        size: 10,
        outerBorder: {
          distance: 0,
          lineWidth: 6,
          strokeOpacity: 0.2
        }
      }
    }
  },
  line: {
    style: {
      // Configure the lineDash attribute based on the forecast field value of the data
      lineDash: (data: any) => {
        if (data.forecast) {
          return [5, 5];
        }
        return [0];
      }
    }
  },
  area: {
    style: {
      fillOpacity: 0.5,
      textureColor: '#fff',
      textureSize: 14,
      // Configure the texture attribute based on the forecast field value of the data
      texture: (data: any) => {
        if (data.forecast) {
          return 'bias-rl';
        }
        return '';
      }
    }
  },
  legends: [{ visible: true, position: 'middle', orient: 'bottom' }],
  crosshair: {
    xField: {
      visible: true,
      line: {
        type: 'line'
      }
    }
  }
};

export const barMarkPointSpec: IBarChartSpec = {
  type: 'bar',
  height: 300,
  data: [
    {
      id: 'barData',
      values: [
        { time: '10:20', cost: 2 },
        { time: '10:30', cost: 1 },
        { time: '10:40', cost: 1 },
        { time: '10:50', cost: 2 },
        { time: '11:00', cost: 2 },
        { time: '11:10', cost: 2 },
        { time: '11:20', cost: 1 },
        { time: '11:30', cost: 1 },
        { time: '11:40', cost: 2 },
        { time: '11:50', cost: 1 }
      ]
    }
  ],
  xField: 'time',
  yField: 'cost',
  crosshair: {
    xField: {
      visible: true,
      line: {
        type: 'rect',
        style: {
          fill: 'rgb(85,208,93)',
          fillOpacity: 0.1
        }
      },
      bindingAxesIndex: [1],
      defaultSelect: {
        axisIndex: 1,
        datum: '10:20'
      }
    }
  },
  label: {
    visible: true,
    animation: false,
    formatMethod: (datum: any) => `${datum}分钟`,
    style: {
      fill: 'rgb(155,155,155)'
    }
  },
  bar: {
    style: {
      fill: 'rgb(85,208,93)',
      cornerRadius: [4, 4, 0, 0],
      width: 30
    }
  },
  markPoint: [
    {
      coordinate: {
        time: '10:20',
        cost: 2
      },
      itemContent: {
        type: 'text',
        // autoRotate: false,
        offsetY: -10,
        text: {
          dy: 14,
          text: '2分钟',
          style: {
            fill: 'white',
            fontSize: 14
          },
          labelBackground: {
            padding: [5, 10, 5, 10],
            style: {
              fill: '#000',
              cornerRadius: 5
            }
          }
        }
      },
      itemLine: {
        endSymbol: {
          visible: true,
          style: {
            angle: Math.PI,
            scaleY: 0.4,
            fill: '#000',
            dy: 4,
            stroke: '#000'
          }
        },
        startSymbol: { visible: false },
        line: {
          style: {
            visible: false
          }
        }
      }
    }
  ],
  animationUpdate: false,
  axes: [
    {
      orient: 'left',
      max: 10,
      label: { visible: false },
      grid: {
        style: { lineDash: [4, 4] }
      }
    },
    {
      orient: 'bottom',
      label: {
        formatMethod: (datum: any) => {
          return datum === '10:20' ? '当前' : datum;
        },
        style: (datum: any) => {
          return {
            fontSize: datum === '10:20' ? 14 : 12,
            fill: datum === '10:20' ? 'black' : 'grey'
          };
        }
      },
      paddingOuter: 0.5,
      paddingInner: 0,
      grid: {
        visible: true,
        alignWithLabel: false,
        style: { lineDash: [4, 4] }
      }
    }
  ]
};

export const histogramDifferentBinSpec: IHistogramChartSpec = {
  type: 'histogram',
  xField: 'from',
  x2Field: 'to',
  yField: 'profit',
  seriesField: 'type',
  bar: {
    style: {
      stroke: 'white',
      lineWidth: 1
    }
  },
  title: {
    text: 'Profit',
    textStyle: {
      align: 'center',
      height: 50,
      lineWidth: 3,
      fill: '#333',
      fontSize: 25,
      fontFamily: 'Times New Roman'
    }
  },
  tooltip: {
    visible: true,
    mark: {
      title: {
        key: 'title',
        value: 'profit'
      },
      content: [
        {
          key: (datum?: Record<string, any>) => `${datum?.from}～${datum?.to}`,
          value: (datum?: Record<string, any>) => datum?.profit
        }
      ]
    }
  },
  axes: [
    {
      orient: 'bottom',
      nice: false
    }
  ],
  data: [
    {
      name: 'data1',
      values: [
        {
          from: 0,
          to: 10,
          profit: 2,
          type: 'A'
        },
        {
          from: 10,
          to: 16,
          profit: 3,
          type: 'B'
        },
        {
          from: 16,
          to: 18,
          profit: 15,
          type: 'C'
        },
        {
          from: 18,
          to: 26,
          profit: 12,
          type: 'D'
        },
        {
          from: 26,
          to: 32,
          profit: 22,
          type: 'E'
        },
        {
          from: 32,
          to: 56,
          profit: 7,
          type: 'F'
        },
        {
          from: 56,
          to: 62,
          profit: 17,
          type: 'G'
        }
      ]
    }
  ]
};
