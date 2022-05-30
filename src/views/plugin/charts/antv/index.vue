<template>
  <n-space :vertical="true" :size="16">
    <n-card :bordered="false" class="rounded-16px shadow-sm">
      <div ref="pieRef" class="h-400px"></div>
    </n-card>
    <n-card :bordered="false" class="rounded-16px shadow-sm">
      <div ref="lineRef" class="h-400px"></div>
    </n-card>
    <n-card :bordered="false" class="rounded-16px shadow-sm">
      <div ref="barRef" class="h-400px"></div>
    </n-card>
    <n-card :bordered="false" class="rounded-16px shadow-sm">
      <div ref="scatterRef" class="h-400px"></div>
    </n-card>
  </n-space>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import DataSet from '@antv/data-set';
import { Chart } from '@antv/g2';

const pieRef = ref<HTMLElement | null>(null);
const lineRef = ref<HTMLElement | null>(null);
const barRef = ref<HTMLElement | null>(null);
const scatterRef = ref<HTMLElement | null>(null);

function renderPieChart() {
  if (!pieRef.value) return;

  const data = [
    { item: 'rose 1', count: 40, percent: 0.4 },
    { item: 'rose 2', count: 40, percent: 0.4 },
    { item: 'rose 3', count: 40, percent: 0.4 },
    { item: 'rose 4', count: 40, percent: 0.4 },
    { item: 'rose 5', count: 21, percent: 0.21 },
    { item: 'rose 6', count: 17, percent: 0.17 },
    { item: 'rose 7', count: 13, percent: 0.13 },
    { item: 'rose 8', count: 9, percent: 0.09 }
  ];

  const chart = new Chart({
    container: pieRef.value,
    autoFit: true
  });

  chart.data(data);

  chart.coordinate('theta', {
    radius: 0.85
  });

  chart.scale('percent', {
    formatter: (val: number) => `${val * 100}%`
  });
  chart.tooltip({
    showTitle: false,
    showMarkers: false
  });
  chart.legend({ position: 'top' });
  chart.axis(false); // 关闭坐标轴
  chart
    .interval()
    .adjust('stack')
    .position('percent')
    .color('item')
    .label('percent', {
      offset: -40,
      style: {
        textAlign: 'center',
        shadowBlur: 2,
        shadowColor: 'rgba(0, 0, 0, .45)',
        fill: '#fff'
      }
    })
    .tooltip('item*percent', (item, percent) => {
      return {
        name: item,
        value: `${percent * 100}%`
      };
    })
    .style({
      lineWidth: 1,
      stroke: '#fff'
    });
  chart.interaction('element-single-selected');
  chart.render();
}

function renderLineChart() {
  fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/terrorism.json')
    .then(res => res.json())
    .then(data => {
      const ds = new DataSet();
      if (!lineRef.value) return;

      const chart = new Chart({
        container: lineRef.value,
        autoFit: true,
        syncViewPadding: true
      });

      chart.scale({
        Deaths: {
          sync: true,
          nice: true
        },
        death: {
          sync: true,
          nice: true
        }
      });

      const dv1 = ds.createView().source(data);
      dv1.transform({
        type: 'map',
        callback: (row: any) => {
          const currentRow = { ...row };
          if (typeof row.Deaths === 'string') {
            currentRow.Deaths = row.Deaths.replace(',', '');
          }
          currentRow.Deaths = parseInt(row.Deaths, 10);
          currentRow.death = row.Deaths;
          currentRow.year = row.Year;
          return currentRow;
        }
      });
      const view1 = chart.createView();
      view1.data(dv1.rows);
      view1.axis('Year', {
        subTickLine: {
          count: 3,
          length: 3
        },
        tickLine: {
          length: 6
        }
      });
      view1.axis('Deaths', {
        label: {
          formatter: text => {
            return text.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
          }
        }
      });
      view1.line().position('Year*Deaths');

      const dv2 = ds.createView().source(dv1.rows);
      dv2.transform({
        type: 'regression',
        method: 'polynomial',
        fields: ['year', 'death'],
        bandwidth: 0.1,
        as: ['year', 'death']
      });

      const view2 = chart.createView();
      view2.axis(false);
      view2.data(dv2.rows);
      view2
        .line()
        .position('year*death')
        .style({
          stroke: '#969696',
          lineDash: [3, 3]
        })
        .tooltip(false);
      view1.annotation().text({
        content: '趋势线',
        position: ['1970', 2500],
        style: {
          fill: '#8c8c8c',
          fontSize: 14,
          fontWeight: 300
        },
        offsetY: -70
      });
      chart.render();
    });
}

function renderBarChart() {
  if (!barRef.value) return;

  const data = [
    { type: '未知', value: 654, percent: 0.02 },
    { type: '17 岁以下', value: 654, percent: 0.02 },
    { type: '18-24 岁', value: 4400, percent: 0.2 },
    { type: '25-29 岁', value: 5300, percent: 0.24 },
    { type: '30-39 岁', value: 6200, percent: 0.28 },
    { type: '40-49 岁', value: 3300, percent: 0.14 },
    { type: '50 岁以上', value: 1500, percent: 0.06 }
  ];

  const chart = new Chart({
    container: barRef.value,
    autoFit: true,
    height: 500,
    padding: [50, 20, 50, 20]
  });
  chart.data(data);
  chart.scale('value', {
    alias: '销售额(万)'
  });

  chart.axis('type', {
    tickLine: {
      alignTick: false
    }
  });
  chart.axis('value', false);

  chart.tooltip({
    showMarkers: false
  });
  chart.interval().position('type*value');
  chart.interaction('element-active');

  // 添加文本标注
  data.forEach(item => {
    chart
      .annotation()
      .text({
        position: [item.type, item.value],
        content: item.value,
        style: {
          textAlign: 'center'
        },
        offsetY: -30
      })
      .text({
        position: [item.type, item.value],
        content: `${(item.percent * 100).toFixed(0)}%`,
        style: {
          textAlign: 'center'
        },
        offsetY: -12
      });
  });
  chart.render();
}

function renderScatterChart() {
  fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/scatter.json')
    .then(res => res.json())
    .then(data => {
      if (!scatterRef.value) return;

      const chart = new Chart({
        container: scatterRef.value,
        autoFit: true,
        height: 500
      });
      chart.data(data);
      chart.scale({
        height: { nice: true },
        weight: { nice: true }
      });
      chart.tooltip({
        showTitle: false,
        showCrosshairs: true,
        crosshairs: {
          type: 'xy'
        },
        itemTpl:
          '<li class="g2-tooltip-list-item" data-index={index} style="margin-bottom:4px;">' +
          '<span style="background-color:{color};" class="g2-tooltip-marker"></span>' +
          '{name}<br/>' +
          '{value}' +
          '</li>'
      });
      chart
        .point()
        .position('height*weight')
        .color('gender')
        .shape('circle')
        .tooltip('gender*height*weight', (gender, height, weight) => {
          return {
            name: gender,
            value: `${height}(cm), ${weight}(kg)`
          };
        })
        .style({
          fillOpacity: 0.85
        });
      chart.interaction('legend-highlight');
      chart.render();
    });
}

function init() {
  renderPieChart();
  renderLineChart();
  renderBarChart();
  renderScatterChart();
}

onMounted(() => {
  init();
});
</script>

<style scoped></style>
