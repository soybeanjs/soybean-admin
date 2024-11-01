import { Graph } from '@antv/g6';
import type { CustomBehaviorOption, IPointerEvent } from '@antv/g6';
import type { Canvas } from '@antv/g6/lib/runtime/canvas';
import { useThemeStore } from '@/store/modules/theme';
import { getNodeIcon, nodeStatus } from './status';
import type { CustomEdgeData, CustomGraphData, CustomNodeData } from './types';

interface AntFlowConfig {
  container: string | HTMLElement | Canvas;
  data: CustomGraphData;
  behaviors?: CustomBehaviorOption[];
  autoFit?: 'view' | 'center';
}

export function useAntFlow(config: AntFlowConfig) {
  const themeStore = useThemeStore();

  const baseColor = 'rgb(158 163 171)';

  const { container, autoFit = 'center', data, behaviors = [] } = config;

  const graph = new Graph({
    container,
    animation: false,
    padding: 16,
    theme: 'light',
    autoFit,
    data,
    node: {
      type: 'rect',

      style: (node: CustomNodeData) => {
        const iconS = getNodeIcon(node);
        let labelFill = '#000000';
        if (node.taskState === 'NOT_STARTED') {
          labelFill = '#787878';
        }

        return {
          labelText: node.name as string,
          size: [120, 26],
          radius: 99,
          fill: '#FFFFFF',
          stroke: node.isDeleted ? themeStore.otherColor.error : baseColor,
          lineDash: node.isDeleted ? 4 : 0,
          lineWidth: 1,
          labelFill,
          labelX: 2,
          labelY: 2,
          labelTextBaseline: 'middle',
          labelTextAlign: 'center',
          labelLineHeight: 13,
          labelWordWrap: true,
          labelMaxWidth: 72,
          iconSrc: iconS,
          iconWidth: 16,
          iconHeight: 16,
          iconX: -45,
          labelFontSize: 12,
          labelPlacement: 'center',
          badgeLineWidth: 6,
          badgeFontSize: 8,
          badges: [
            { text: '延期', placement: 'top', offsetY: -11, visibility: node.isDelayed ? 'visible' : 'hidden' },
            { text: '已删除', placement: 'bottom', offsetY: 11, visibility: node.isDeleted ? 'visible' : 'hidden' }
          ],
          badgePalette: [themeStore.otherColor.error, themeStore.otherColor.error],
          ports: [{ placement: 'left' }, { placement: 'right' }]
        };
      },
      state: {
        selected: {
          lineWidth: 2,
          stroke: themeStore.themeColor,
          labelFill: themeStore.themeColor,
          halo: true,
          haloStroke: themeStore.themeColor,
          haloLineWidth: 6
        },
        active: (node: CustomNodeData) => ({
          halo: true,
          haloStroke: node.isDeleted ? themeStore.otherColor.error : themeStore.themeColor,
          haloLineWidth: 6,
          zIndex: 2
        })
      }
    },
    edge: {
      type: 'cubic-horizontal',
      style: (node: CustomEdgeData) => ({
        curveOffset: 10,
        curvePosition: 0.5,
        stroke: node.isDeleted ? themeStore.otherColor.error : baseColor,
        lineDash: node.isDeleted ? 4 : 0
      }),
      state: {
        active: (node: CustomEdgeData) => ({
          lineWidth: 2,
          stroke: node.isDeleted ? themeStore.otherColor.error : themeStore.themeColor,
          halo: true,
          haloStroke: node.isDeleted ? themeStore.otherColor.error : themeStore.themeColor,
          haloLineWidth: 6,
          zIndex: 2
        })
      }
    },
    layout: {
      type: 'antv-dagre',
      rankdir: 'LR',
      ranksep: 20,
      nodesep: -20,
      controlPoints: true
    },
    behaviors: [
      {
        key: 'hover-activate',
        type: 'hover-activate',
        degree: 1,
        direction: 'both'
      },
      'drag-canvas',
      ...behaviors
    ],
    plugins: [
      {
        type: 'tooltip',
        enable: (event: IPointerEvent) => event.targetType === 'node',
        getContent: (_event: IPointerEvent, items?: CustomNodeData[]) => {
          let result = '<div style="display: flex; flex-direction: column; gap: 8px;">';

          // 弹出提示可以自定义各种内容，但是这里很奇怪，有的class不跟随unocss的样式
          items?.forEach(item => {
            result += `<h3 style="display: flex; align-items: center; gap: 8px;">${item.name}</h3>`;
            result += `<div style="display: flex;"><b>状态：</b><div style="display: flex; gap: 4px;"><img src="${getNodeIcon(item)}" /><span style="font-weight: 400 !important;">${nodeStatus[item.status as keyof typeof nodeStatus].type}</span></div></div>`;

            result += `<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 32px; row-gap: 4px;">`;
            result += `<div style="display: flex; flex-direction: column;"><div style="color: rgb(156 163 175);">预计开始</div><div style="font-weight: 700;">${item.startDate || '-'}</div></div>`;
            result += `<div style="display: flex; flex-direction: column;"><div style="color: rgb(156 163 175);">预计结束</div><div style="font-weight: 700;">${item.endDate || '-'}</div></div>`;
            result += `<div style="display: flex; flex-direction: column;"><div style="color: rgb(156 163 175);">实际开始</div><div style="font-weight: 700;">${item.actualStartDate || '-'}</div></div>`;
            result += `<div style="display: flex; flex-direction: column;"><div style="color: rgb(156 163 175);">实际结束</div><div style="font-weight: 700;">${item.actualEndDate || '-'}</div></div>`;
            result += `</div>`;
          });

          result += '</div>';
          return result;
        }
      }
    ]
  });
  graph.render();

  return {
    graph
  };
}
