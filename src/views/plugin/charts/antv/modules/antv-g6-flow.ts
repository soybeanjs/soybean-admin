import { Graph } from '@antv/g6';
import type { CustomBehaviorOption, IPointerEvent } from '@antv/g6';
import type { NodeStyle } from '@antv/g6/lib/spec/element/node';
import { getNodeIcon, nodeStatus } from './status';
import type { CustomEdgeData, CustomGraphData, CustomNodeData } from './types';

/**
 * AntV G6 流程图（P4-01，v2 `modules/antv-g6-flow.ts` 的移植）。
 *
 * 与 v2 的差异：
 * - 主题色不再从 `useThemeStore()` 取（v3 无该 store），改为构造时传入的
 *   `palette`（`primary` / `destructive` 的完整 CSS 颜色，由调用方从
 *   `@vean/theme` 的 `resolveTokenColor()` + `useTheme()` 状态算出来）——
 *   G6 要的是具体颜色字符串，不是 CSS 变量，所以必须在 Vue 侧解析；
 * - `import type { Canvas } from '@antv/g6/lib/runtime/canvas'` 在本版
 *   **不存在**（g6 5.1.1 无该深路径）→ 从 `@antv/g6` 根导入 `Canvas`；
 * - tooltip 的 HTML 换行由内联样式负责（G6 的 tooltip 挂在 canvas 容器外，
 *   UnoCSS 的类名对它无效，v2 的注释也提到过这点）。
 */
export interface AntFlowPalette {
  /** 主色（选中态、高亮 halo） */
  primary: string;
  /** 危险色（删除、延期） */
  destructive: string;
  /** 是否深色模式（节点底色与文字色跟着变） */
  dark: boolean;
}

interface AntFlowConfig {
  container: HTMLElement;
  data: CustomGraphData;
  palette: AntFlowPalette;
  behaviors?: CustomBehaviorOption[];
  autoFit?: 'view' | 'center';
}

/** 连线与未删除节点的描边色（中性灰） */
const BASE_COLOR = 'rgb(158 163 171)';

/** tooltip 里一行的字段描述 */
interface TooltipField {
  label: string;
  value: string | undefined;
}

export function useAntFlow(config: AntFlowConfig) {
  const { container, autoFit = 'center', data, palette, behaviors = [] } = config;

  /** 节点底色：深色下用卡片色，浅色下用白 */
  const nodeFill = palette.dark ? '#1f1f1f' : '#ffffff';
  const primaryLabelFill = palette.dark ? '#e5e5e5' : '#000000';

  const graph = new Graph({
    container,
    animation: false,
    padding: 16,
    theme: palette.dark ? 'dark' : 'light',
    autoFit,
    data,
    node: {
      type: 'rect',

      style: (node: CustomNodeData): NodeStyle => {
        const iconSrc = getNodeIcon(node);

        return {
          labelText: node.name ?? '',
          size: [120, 26],
          radius: 99,
          fill: nodeFill,
          stroke: node.isDeleted ? palette.destructive : BASE_COLOR,
          lineDash: node.isDeleted ? 4 : 0,
          lineWidth: 1,
          labelFill: primaryLabelFill,
          labelX: 2,
          labelY: 2,
          labelTextBaseline: 'middle',
          labelTextAlign: 'center',
          labelLineHeight: 13,
          labelWordWrap: true,
          labelMaxWidth: 72,
          iconSrc,
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
          badgePalette: [palette.destructive, palette.destructive],
          ports: [{ placement: 'left' }, { placement: 'right' }]
        };
      },
      state: {
        selected: {
          lineWidth: 2,
          stroke: palette.primary,
          labelFill: palette.primary,
          halo: true,
          haloStroke: palette.primary,
          haloLineWidth: 6
        },
        active: (node: CustomNodeData) => ({
          halo: true,
          haloStroke: node.isDeleted ? palette.destructive : palette.primary,
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
        stroke: node.isDeleted ? palette.destructive : BASE_COLOR,
        lineDash: node.isDeleted ? 4 : 0
      }),
      state: {
        active: (node: CustomEdgeData) => ({
          lineWidth: 2,
          stroke: node.isDeleted ? palette.destructive : palette.primary,
          halo: true,
          haloStroke: node.isDeleted ? palette.destructive : palette.primary,
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
        getContent: (_event: IPointerEvent, items?: CustomNodeData[]) => renderTooltip(items ?? [], palette.dark)
      }
    ]
  });

  graph.render();

  return { graph };
}

/**
 * tooltip 的 HTML。
 *
 * G6 把 tooltip 节点插在 canvas 容器的**外层**，UnoCSS 的作用域覆盖不到，
 * 因此这里只能写内联样式（v2 的同名注释也是这个原因）。
 */
function renderTooltip(items: CustomNodeData[], dark: boolean): string {
  const mutedColor = dark ? 'rgb(161 161 170)' : 'rgb(156 163 175)';
  const textColor = dark ? '#e5e5e5' : '#111827';

  const rows = items
    .map(item => {
      const statusType = item.status ? nodeStatus[item.status].type : '-';
      const fields: TooltipField[] = [
        { label: '预计开始', value: item.startDate },
        { label: '预计结束', value: item.endDate },
        { label: '实际开始', value: item.actualStartDate },
        { label: '实际结束', value: item.actualEndDate }
      ];

      const fieldsHtml = fields
        .map(
          field =>
            `<div style="display:flex;flex-direction:column;"><div style="color:${mutedColor};">${field.label}</div>` +
            `<div style="font-weight:700;">${field.value ?? '-'}</div></div>`
        )
        .join('');

      return (
        `<h3 style="display:flex;align-items:center;gap:8px;color:${textColor};">${item.name ?? ''}</h3>` +
        `<div style="display:flex;"><b>状态：</b><div style="display:flex;gap:4px;align-items:center;">` +
        `<img alt="" src="${getNodeIcon(item)}" /><span style="font-weight:400;">${statusType}</span></div></div>` +
        `<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:32px;row-gap:4px;">${fieldsHtml}</div>`
      );
    })
    .join('');

  return `<div style="display:flex;flex-direction:column;gap:8px;color:${textColor};">${rows}</div>`;
}
