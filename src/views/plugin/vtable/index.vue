<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { SCard, useTheme } from '@vean/ui';
import VChart from '@visactor/vchart';
import {
  Group,
  Image,
  ListColumn,
  ListTable,
  Menu,
  PivotChart,
  PivotColumnDimension,
  PivotCorner,
  PivotIndicator,
  PivotRowDimension,
  PivotTable,
  Tag,
  Text,
  VTable,
  registerChartModule
} from '@visactor/vue-vtable';
import { PluginDocLinks } from '../modules';
import {
  customListRecords,
  listTableRecords,
  pivotChartColumns,
  pivotChartIndicators,
  pivotChartRecords,
  pivotChartRows,
  pivotTableRecords
} from './data';

/**
 * VTable 四种表格形态的演示（P4-01，v2 `views/plugin/vtable/index.vue` 的移植）。
 *
 * 与 v2 的差异：
 * - `useThemeStore().darkMode` → `useTheme().effectiveMode`（v3 无 theme store）；
 * - 两张 pivot 表的 records 从远程 fetch 改为本地静态数据（演示页不该依赖外部
 *   站点可用性，也避免演示页偷偷发请求）；
 * - 去掉 `any` / `as` 断言：`@visactor/vue-vtable` 的表格组件类型是
 *   `DefineComponent<Record<string, never>, ...>`（props / emits 全无类型），
 *   所以模板属性不参与类型检查，实例方法改用运行时类型守卫；
 * - `NSpace` / `NCard` / 全局 `WebSiteLink` → `SCard` + `PluginDocLinks`。
 */

registerChartModule('vchart', VChart);

/** 分组标题的取色池（按分组层级轮转） */
const titleColorPool = ['#3370ff', '#34c724', '#ff9f1a', '#ff4050', '#1f2329'];

/** 右键菜单项（提到脚本里，模板属性写数组字面量会触发 vue-tsc 解析问题） */
const contextMenuItems = ['copy', 'paste', 'delete', '...'];

/** 透视表角头维度（v2 用本地 ref，这里没有交互，收成常量） */
const pivotTableRows: VTable.TYPES.IRowDimension[] = [
  {
    dimensionKey: 'City',
    title: 'City',
    headerStyle: { textStick: true },
    width: 'auto'
  }
];

/** 数值列的正负着色：`dataValue` 是 `FieldData`（`unknown`），先收窄再比较 */
function indicatorColor(args: VTable.TYPES.StylePropertyFunctionArg): string {
  const value = Number(args.dataValue);

  return Number.isFinite(value) && value < 0 ? 'red' : 'black';
}

const pivotTableIndicators: VTable.TYPES.IIndicator[] = [
  {
    indicatorKey: 'Quantity',
    title: 'Quantity',
    width: 'auto',
    showSort: false,
    headerStyle: { fontWeight: 'normal' },
    style: {
      padding: [16, 28, 16, 28],
      color: indicatorColor
    }
  },
  {
    indicatorKey: 'Sales',
    title: 'Sales',
    width: 'auto',
    showSort: false,
    headerStyle: { fontWeight: 'normal' },
    format: formatCurrency,
    style: {
      padding: [16, 28, 16, 28],
      color: indicatorColor
    }
  },
  {
    indicatorKey: 'Profit',
    title: 'Profit',
    width: 'auto',
    showSort: false,
    headerStyle: { fontWeight: 'normal' },
    format: formatCurrency,
    style: {
      padding: [16, 28, 16, 28],
      color: indicatorColor
    }
  }
];

function formatCurrency(record: unknown): string {
  return `$${Number(record).toFixed(2)}`;
}

/** 自定义单元格列的表头/内容字体 */
const customLayoutColumnStyle = { fontFamily: 'Arial', fontSize: 12, fontWeight: 'bold' };

/** 自定义单元格的「粉丝数」「作品数」「播放量」后缀 */
function fansText(record: { fansCount: number }): string {
  return `${record.fansCount}w`;
}

function viewText(record: { viewCount: number }): string {
  return `${record.viewCount}w`;
}

/** 「更多 VTable 示例」的外部链接 */
const docLinks = [{ label: 'VisActor VTable', href: 'https://www.visactor.com/vtable/example' }];

const { t } = useI18n();
const { effectiveMode } = useTheme();

const isDark = computed(() => effectiveMode.value === 'dark');

/** 基础主题（`extends` 会派生新对象，不会污染 `VTable.themes` 的共享实例） */
function baseTheme(): typeof VTable.themes.DEFAULT {
  return isDark.value ? VTable.themes.DARK : VTable.themes.DEFAULT;
}

/**
 * 分组标题背景色。
 *
 * `args.table` 是表格实例，`getGroupTitleLevel(col, row)` 给出该单元格所处分组
 * 层级（0 起），据此在取色池里轮转。层级取不到时用白色兜底。
 */
function groupTitleBackground(args: VTable.TYPES.StylePropertyFunctionArg): string {
  const level = args.table.getGroupTitleLevel(args.col, args.row);

  return level === undefined ? 'white' : (titleColorPool[level % titleColorPool.length] ?? 'white');
}

const listOptions = computed<VTable.TYPES.ListTableConstructorOptions>(() => ({
  theme: baseTheme()
}));

const groupOptions = computed<VTable.TYPES.ListTableConstructorOptions>(() => ({
  groupConfig: {
    groupBy: ['Category', 'Sub-Category']
  },
  theme: baseTheme().extends({
    groupTitleStyle: {
      fontWeight: 'bold',
      bgColor: groupTitleBackground
    }
  })
}));

const pivotTableOptions = computed<VTable.TYPES.PivotTableConstructorOptions>(() => ({
  tooltip: {
    isShowOverflowTextTooltip: true
  },
  dataConfig: {
    sortRules: [
      {
        sortField: 'Category',
        sortBy: ['Office Supplies', 'Technology', 'Furniture']
      }
    ]
  },
  widthMode: 'standard',
  theme: baseTheme(),
  emptyTip: {
    text: 'no data records'
  }
}));

/** 透视图表图例：9 个 `Segment-Indicator` 组合各一项 */
const pivotChartLegends = [
  { label: 'Consumer-Quantity', shape: { fill: '#2E62F1', symbolType: 'circle' } },
  { label: 'Consumer-Quantity', shape: { fill: '#4DC36A', symbolType: 'square' } },
  { label: 'Home Office-Quantity', shape: { fill: '#FF8406', symbolType: 'square' } },
  { label: 'Consumer-Sales', shape: { fill: '#FFCC00', symbolType: 'square' } },
  { label: 'Consumer-Sales', shape: { fill: '#4F44CF', symbolType: 'square' } },
  { label: 'Home Office-Sales', shape: { fill: '#5AC8FA', symbolType: 'square' } },
  { label: 'Consumer-Profit', shape: { fill: '#003A8C', symbolType: 'square' } },
  { label: 'Consumer-Profit', shape: { fill: '#B08AE2', symbolType: 'square' } },
  { label: 'Home Office-Profit', shape: { fill: '#FF6341', symbolType: 'square' } }
];

const pivotChartOptions = computed<VTable.TYPES.PivotChartConstructorOptions>(() => ({
  rows: pivotChartRows,
  columns: pivotChartColumns,
  indicators: pivotChartIndicators,
  indicatorsAsCol: false,
  defaultRowHeight: 200,
  defaultHeaderRowHeight: 50,
  defaultColWidth: 280,
  defaultHeaderColWidth: 100,
  indicatorTitle: t('plugin.pivotTable'),
  autoWrapText: true,
  corner: {
    titleOnDimension: 'row',
    headerStyle: { autoWrapText: true }
  },
  legends: {
    orient: 'bottom',
    type: 'discrete',
    data: pivotChartLegends
  },
  theme: baseTheme().extends({
    bodyStyle: { borderColor: 'gray', borderLineWidth: [1, 0, 0, 1] },
    headerStyle: { borderColor: 'gray', borderLineWidth: [0, 0, 1, 1], hover: { cellBgColor: '#CCE0FF' } },
    rowHeaderStyle: { borderColor: 'gray', borderLineWidth: [1, 1, 0, 0], hover: { cellBgColor: '#CCE0FF' } },
    cornerHeaderStyle: { borderColor: 'gray', borderLineWidth: [0, 1, 1, 0], hover: { cellBgColor: '' } },
    cornerRightTopCellStyle: { borderColor: 'gray', borderLineWidth: [0, 0, 1, 1], hover: { cellBgColor: '' } },
    cornerLeftBottomCellStyle: { borderColor: 'gray', borderLineWidth: [1, 1, 0, 0], hover: { cellBgColor: '' } },
    cornerRightBottomCellStyle: { borderColor: 'gray', borderLineWidth: [1, 0, 0, 1], hover: { cellBgColor: '' } },
    rightFrozenStyle: { borderColor: 'gray', borderLineWidth: [1, 0, 1, 1], hover: { cellBgColor: '' } },
    bottomFrozenStyle: { borderColor: 'gray', borderLineWidth: [1, 1, 0, 1], hover: { cellBgColor: '' } },
    selectionStyle: { cellBgColor: '', cellBorderColor: '' },
    frameStyle: { borderLineWidth: 0 }
  }),
  emptyTip: {
    text: 'no data records'
  }
}));

const customLayoutListTableOptions = computed<VTable.TYPES.ListTableConstructorOptions>(() => ({
  defaultRowHeight: 80,
  theme: baseTheme()
}));

/** 图例点击时表格实例暴露出来的能力（组件类型零信息，只能运行时守卫） */
interface FilterableTable {
  updateFilterRules: (
    rules: { filterKey: string; filteredValues: unknown[] }[],
    options: { clearRowHeightCache?: boolean }
  ) => void;
}

/** 从组件实例上取出 `vTableInstance` 并确认它具备 `updateFilterRules` */
function readFilterableTable(instance: unknown): FilterableTable | undefined {
  if (typeof instance !== 'object' || instance === null || !('vTableInstance' in instance)) return undefined;

  const { vTableInstance } = instance;

  if (typeof vTableInstance !== 'object' || vTableInstance === null || !('updateFilterRules' in vTableInstance)) {
    return undefined;
  }

  const { updateFilterRules } = vTableInstance;

  if (typeof updateFilterRules !== 'function') return undefined;

  return {
    updateFilterRules: (rules, options) => {
      updateFilterRules.call(vTableInstance, rules, options);
    }
  };
}

const pivotChartRef = useTemplateRef<unknown>('pivotChartRef');

/** 点击图例时按 `Segment-Indicator` 过滤透视图 */
function handleLegendItemClick(args: { value: unknown }) {
  const table = readFilterableTable(pivotChartRef.value);

  table?.updateFilterRules([{ filterKey: 'Segment-Indicator', filteredValues: [args.value] }], {});
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <SCard :title="t('plugin.listTable')">
      <ListTable :options="listOptions" :records="listTableRecords" height="400px">
        <ListColumn field="Order ID" title="Order ID" width="auto" />
        <ListColumn field="Customer ID" title="Customer ID" width="auto" />
        <ListColumn field="Product Name" title="Product Name" width="auto" />
        <ListColumn field="Category" title="Category" width="auto" />
        <ListColumn field="Sub-Category" title="Sub-Category" width="auto" />
        <ListColumn field="Region" title="Region" width="auto" />
        <ListColumn field="City" title="City" width="auto" />
        <ListColumn field="Order Date" title="Order Date" width="auto" />
        <ListColumn field="Quantity" title="Quantity" width="auto" />
        <ListColumn field="Sales" title="Sales" width="auto" />
        <ListColumn field="Profit" title="Profit" width="auto" />
      </ListTable>
    </SCard>

    <SCard :title="t('plugin.groupTable')">
      <ListTable :options="groupOptions" :records="listTableRecords" height="400px">
        <ListColumn field="Order ID" title="Order ID" width="auto" />
        <ListColumn field="Customer ID" title="Customer ID" width="auto" />
        <ListColumn field="Product Name" title="Product Name" width="auto" />
        <ListColumn field="Category" title="Category" width="auto" />
        <ListColumn field="Sub-Category" title="Sub-Category" width="auto" />
        <ListColumn field="Region" title="Region" width="auto" />
        <ListColumn field="City" title="City" width="auto" />
        <ListColumn field="Order Date" title="Order Date" width="auto" />
        <ListColumn field="Quantity" title="Quantity" width="auto" />
        <ListColumn field="Sales" title="Sales" width="auto" />
        <ListColumn field="Profit" title="Profit" width="auto" />
      </ListTable>
    </SCard>

    <SCard :title="t('plugin.pivotTable')">
      <PivotTable :options="pivotTableOptions" :records="pivotTableRecords" height="400px">
        <PivotColumnDimension
          title="Category"
          dimension-key="Category"
          :header-style="{ textStick: true }"
          width="auto"
        />
        <PivotRowDimension
          v-for="row in pivotTableRows"
          :key="row.dimensionKey"
          :dimension-key="row.dimensionKey"
          :title="row.title"
          :header-style="row.headerStyle"
          :width="row.width"
        />
        <PivotIndicator
          v-for="indicator in pivotTableIndicators"
          :key="indicator.indicatorKey"
          :indicator-key="indicator.indicatorKey"
          :title="indicator.title"
          :width="indicator.width"
          :show-sort="indicator.showSort"
          :header-style="indicator.headerStyle"
          :format="indicator.format"
          :style="indicator.style"
        />
        <PivotCorner title-on-dimension="row" />
        <Menu menu-type="html" :context-menu-items="contextMenuItems" />
      </PivotTable>
    </SCard>

    <SCard :title="t('plugin.pivotChart')">
      <PivotChart
        ref="pivotChartRef"
        :options="pivotChartOptions"
        :records="pivotChartRecords"
        height="800px"
        @on-legend-item-click="handleLegendItemClick"
      />
    </SCard>

    <SCard :title="t('plugin.customTable')">
      <ListTable :options="customLayoutListTableOptions" :records="customListRecords" height="400px">
        <ListColumn field="bloggerId" title="Order Number" width="100" />

        <ListColumn field="bloggerName" title="Anchor Nickname" :width="330">
          <template #customLayout="{ record, height, width }">
            <Group :height="height" :width="width" display="flex" flex-direction="row" flex-wrap="nowrap">
              <Group
                :height="height"
                :width="60"
                display="flex"
                flex-direction="column"
                align-items="center"
                justify-content="space-around"
                fill="red"
                :opacity="0.1"
              >
                <Image id="icon0" :width="50" :height="50" :image="record.bloggerAvatar" :corner-radius="25" />
              </Group>

              <Group :height="height" :width="width - 60" display="flex" flex-direction="column" flex-wrap="nowrap">
                <Group
                  :height="height / 2"
                  :width="width - 60"
                  display="flex"
                  flex-wrap="wrap"
                  align-items="center"
                  fill="orange"
                  :opacity="0.1"
                >
                  <Text
                    :text="record.bloggerName"
                    :font-size="13"
                    font-family="sans-serif"
                    fill="black"
                    :bounds-padding="[0, 0, 0, 10]"
                  />
                  <Image id="location" :width="15" :height="15" cursor="pointer" />
                  <Text :text="record.city" :font-size="11" font-family="sans-serif" fill="#6f7070" />
                </Group>

                <Group
                  :height="height / 2"
                  :width="width - 60"
                  display="flex"
                  align-items="center"
                  fill="yellow"
                  :opacity="0.1"
                >
                  <Tag
                    v-for="tag in record.tags"
                    :key="tag"
                    :text="tag"
                    :text-style="{ fontSize: 10, fontFamily: 'sans-serif', fill: 'rgb(51, 101, 238)' }"
                    :panel="{ visible: true, fill: '#f4f4f2', cornerRadius: 5 }"
                    :space="5"
                    :bounds-padding="[0, 0, 0, 5]"
                  />
                </Group>
              </Group>
            </Group>
          </template>
        </ListColumn>

        <ListColumn
          field="fansCount"
          title="Fans Count"
          width="120"
          :field-format="fansText"
          :style="customLayoutColumnStyle"
        />
        <ListColumn field="worksCount" title="Works Count" :style="customLayoutColumnStyle" width="135" />
        <ListColumn
          field="viewCount"
          title="View Count"
          width="120"
          :field-format="viewText"
          :style="customLayoutColumnStyle"
        />
      </ListTable>
    </SCard>

    <SCard>
      <PluginDocLinks :links="docLinks" />
    </SCard>
  </div>
</template>
