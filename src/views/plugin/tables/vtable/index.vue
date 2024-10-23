<script setup lang="tsx">
import { onMounted, ref } from 'vue';
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
  registerChartModule
} from '@visactor/vue-vtable';
import VChart from '@visactor/vchart';
import { listTableRecords } from './data';

registerChartModule('vchart', VChart);

// list table
const listTableRef = ref(null);
const listRecords = ref<Record<string, string | number>[]>(listTableRecords);

// pivot table
const pivotTableRef = ref(null);
const pivotTableOptions = ref({
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
  widthMode: 'standard'
});
const pivotTableIndicators = ref([
  {
    indicatorKey: 'Quantity',
    title: 'Quantity',
    width: 'auto',
    showSort: false,
    headerStyle: { fontWeight: 'normal' },
    style: {
      padding: [16, 28, 16, 28],
      color(args: any) {
        return args.dataValue >= 0 ? 'black' : 'red';
      }
    }
  },
  {
    indicatorKey: 'Sales',
    title: 'Sales',
    width: 'auto',
    showSort: false,
    headerStyle: { fontWeight: 'normal' },
    format: (rec: string) => `$${Number(rec).toFixed(2)}`,
    style: {
      padding: [16, 28, 16, 28],
      color(args: any) {
        return args.dataValue >= 0 ? 'black' : 'red';
      }
    }
  },
  {
    indicatorKey: 'Profit',
    title: 'Profit',
    width: 'auto',
    showSort: false,
    headerStyle: { fontWeight: 'normal' },
    format: (rec: string) => `$${Number(rec).toFixed(2)}`,
    style: {
      padding: [16, 28, 16, 28],
      color(args: any) {
        return args.dataValue >= 0 ? 'black' : 'red';
      }
    }
  }
]);
const pivotTableRows = ref([
  {
    dimensionKey: 'City',
    title: 'City',
    headerStyle: { textStick: true },
    width: 'auto'
  }
]);
const pivotTableRecords = ref([]);

// pivot chart
const pivotChartRef = ref(null);
const pivotChartColumns = [
  {
    dimensionKey: 'Region',
    title: 'Region',
    headerStyle: {
      textStick: true
    }
  },
  'Category'
];
const pivotChartRows = [
  {
    dimensionKey: 'Order Year',
    title: 'Order Year',
    headerStyle: {
      textStick: true
    }
  },
  'Ship Mode'
];
const pivotChartIndicators = [
  {
    indicatorKey: 'Quantity',
    title: 'Quantity',
    width: 'auto',
    cellType: 'chart',
    chartModule: 'vchart',
    chartSpec: {
      stack: true,
      type: 'bar',
      data: {
        id: 'data',
        fields: {
          'Sub-Category': {
            sortIndex: 0,
            domain: [
              'Chairs',
              'Tables',
              'Bookcases',
              'Furnishings',
              'Binders',
              'Art',
              'Storage',
              'Appliances',
              'Envelopes',
              'Fasteners',
              'Paper',
              'Labels',
              'Supplies',
              'Accessories',
              'Phones',
              'Copiers',
              'Machines'
            ]
          },
          'Segment-Indicator': {
            sortIndex: 1,
            domain: [
              'Consumer-Quantity',
              'Corporate-Quantity',
              'Home Office-Quantity',
              'Consumer-Sales',
              'Corporate-Sales',
              'Home Office-Sales',
              'Consumer-Profit',
              'Corporate-Profit',
              'Home Office-Profit'
            ]
          }
        }
      },
      xField: ['Sub-Category'],
      yField: 'Quantity',
      seriesField: 'Segment-Indicator',
      axes: [
        { orient: 'left', visible: true, label: { visible: true } },
        { orient: 'bottom', visible: true }
      ],
      bar: {
        state: {
          selected: { fill: 'yellow' },
          selected_reverse: { opacity: 0.2 }
        }
      },
      scales: [
        {
          id: 'color',
          type: 'ordinal',
          domain: [
            'Consumer-Quantity',
            'Corporate-Quantity',
            'Home Office-Quantity',
            'Consumer-Sales',
            'Corporate-Sales',
            'Home Office-Sales',
            'Consumer-Profit',
            'Corporate-Profit',
            'Home Office-Profit'
          ],
          range: [
            '#2E62F1',
            '#4DC36A',
            '#FF8406',
            '#FFCC00',
            '#4F44CF',
            '#5AC8FA',
            '#003A8C',
            '#B08AE2',
            '#FF6341',
            '#98DD62',
            '#07A199',
            '#87DBDD'
          ]
        }
      ]
    },
    style: { padding: 1 }
  },
  {
    indicatorKey: 'Sales',
    title: 'Sales & Profit',
    cellType: 'chart',
    chartModule: 'vchart',
    chartSpec: {
      type: 'common',
      series: [
        {
          type: 'bar',
          data: {
            id: 'data1',
            fields: {
              'Sub-Category': {
                sortIndex: 0,
                domain: [
                  'Chairs',
                  'Tables',
                  'Bookcases',
                  'Furnishings',
                  'Binders',
                  'Art',
                  'Storage',
                  'Appliances',
                  'Envelopes',
                  'Fasteners',
                  'Paper',
                  'Labels',
                  'Supplies',
                  'Accessories',
                  'Phones',
                  'Copiers',
                  'Machines'
                ]
              },
              'Segment-Indicator': {
                sortIndex: 1,
                domain: [
                  'Consumer-Quantity',
                  'Corporate-Quantity',
                  'Home Office-Quantity',
                  'Consumer-Sales',
                  'Corporate-Sales',
                  'Home Office-Sales',
                  'Consumer-Profit',
                  'Corporate-Profit',
                  'Home Office-Profit'
                ]
              }
            }
          },
          stack: true,
          xField: ['Sub-Category'],
          yField: 'Sales',
          seriesField: 'Segment-Indicator',
          bar: {
            state: {
              selected: { fill: 'yellow' },
              selected_reverse: { opacity: 0.2 }
            }
          }
        },
        {
          type: 'line',
          data: {
            id: 'data2',
            fields: {
              'Sub-Category': {
                sortIndex: 0,
                domain: [
                  'Chairs',
                  'Tables',
                  'Bookcases',
                  'Furnishings',
                  'Binders',
                  'Art',
                  'Storage',
                  'Appliances',
                  'Envelopes',
                  'Fasteners',
                  'Paper',
                  'Labels',
                  'Supplies',
                  'Phones',
                  'Accessories',
                  'Machines',
                  'Copiers'
                ]
              },
              'Segment-Indicator': {
                sortIndex: 1,
                domain: [
                  'Consumer-Quantity',
                  'Corporate-Quantity',
                  'Home Office-Quantity',
                  'Consumer-Sales',
                  'Corporate-Sales',
                  'Home Office-Sales',
                  'Consumer-Profit',
                  'Corporate-Profit',
                  'Home Office-Profit'
                ]
              }
            }
          },
          stack: false,
          xField: ['Sub-Category'],
          yField: 'Profit',
          seriesField: 'Segment-Indicator',
          line: {
            state: {
              selected: { lineWidth: 3 },
              selected_reverse: { lineWidth: 1 }
            }
          },
          point: {
            state: {
              selected: { fill: 'yellow' },
              selected_reverse: { fill: '#ddd' }
            }
          }
        }
      ],
      scales: [
        {
          id: 'color',
          type: 'ordinal',
          domain: [
            'Consumer-Quantity',
            'Corporate-Quantity',
            'Home Office-Quantity',
            'Consumer-Sales',
            'Corporate-Sales',
            'Home Office-Sales',
            'Consumer-Profit',
            'Corporate-Profit',
            'Home Office-Profit'
          ],
          range: [
            '#2E62F1',
            '#4DC36A',
            '#FF8406',
            '#FFCC00',
            '#4F44CF',
            '#5AC8FA',
            '#003A8C',
            '#B08AE2',
            '#FF6341',
            '#98DD62',
            '#07A199',
            '#87DBDD'
          ]
        }
      ]
    },
    style: { padding: 1 }
  }
];
const pivotChartOptions = ref({
  rows: pivotChartRows,
  columns: pivotChartColumns,
  indicators: pivotChartIndicators,
  indicatorsAsCol: false,
  defaultRowHeight: 200,
  defaultHeaderRowHeight: 50,
  defaultColWidth: 280,
  defaultHeaderColWidth: 100,
  indicatorTitle: '指标',
  autoWrapText: true,
  corner: {
    titleOnDimension: 'row',
    headerStyle: { autoWrapText: true }
  },
  legends: {
    orient: 'bottom',
    type: 'discrete',
    data: [
      { label: 'Consumer-Quantity', shape: { fill: '#2E62F1', symbolType: 'circle' } },
      { label: 'Consumer-Quantity', shape: { fill: '#4DC36A', symbolType: 'square' } },
      { label: 'Home Office-Quantity', shape: { fill: '#FF8406', symbolType: 'square' } },
      { label: 'Consumer-Sales', shape: { fill: '#FFCC00', symbolType: 'square' } },
      { label: 'Consumer-Sales', shape: { fill: '#4F44CF', symbolType: 'square' } },
      { label: 'Home Office-Sales', shape: { fill: '#5AC8FA', symbolType: 'square' } },
      { label: 'Consumer-Profit', shape: { fill: '#003A8C', symbolType: 'square' } },
      { label: 'Consumer-Profit', shape: { fill: '#B08AE2', symbolType: 'square' } },
      { label: 'Home Office-Profit', shape: { fill: '#FF6341', symbolType: 'square' } }
    ]
  },
  theme: {
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
  }
});
const pivotChartRecords = ref({} as any);
const handleLegendItemClick = (args: { value: any }) => {
  (pivotChartRef?.value as any)?.vTableInstance.updateFilterRules([
    {
      filterKey: 'Segment-Indicator',
      filteredValues: args.value
    }
  ]);
};

// custom layout list table
const customLayoutListTableRef = ref(null);
const customLayoutListTableOptions = ref({
  defaultRowHeight: 80
});
const customLayoutListTableRecords = ref([
  {
    bloggerId: 1,
    bloggerName: 'Virtual Anchor Xiaohua',
    bloggerAvatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/flower.jpg',
    introduction:
      'Hi everyone, I am Xiaohua, the virtual host. I am a little fairy who likes games, animation and food. I hope to share happy moments with you through live broadcast.',
    fansCount: 400,
    worksCount: 10,
    viewCount: 5,
    city: 'Dream City',
    tags: ['game', 'anime', 'food']
  },
  {
    bloggerId: 2,
    bloggerName: 'Virtual anchor little wolf',
    bloggerAvatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/wolf.jpg',
    introduction:
      'Hello everyone, I am the virtual anchor Little Wolf. I like music, travel and photography, and I hope to explore the beauty of the world with you through live broadcast.',
    fansCount: 800,
    worksCount: 20,
    viewCount: 15,
    city: 'City of Music',
    tags: ['music', 'travel', 'photography']
  },
  {
    bloggerId: 3,
    bloggerName: 'Virtual anchor bunny',
    bloggerAvatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/rabbit.jpg',
    introduction:
      'Hello everyone, I am the virtual anchor Xiaotu. I like painting, handicrafts and beauty makeup. I hope to share creativity and fashion with you through live broadcast.',
    fansCount: 600,
    worksCount: 15,
    viewCount: 10,
    city: 'City of Art',
    tags: ['painting', 'handmade', 'beauty makeup']
  },
  {
    bloggerId: 4,
    bloggerName: 'Virtual anchor kitten',
    bloggerAvatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/cat.jpg',
    introduction:
      'Hello everyone, I am the virtual host Kitty. I am a lazy cat who likes dancing, fitness and cooking. I hope to live a healthy and happy life with everyone through the live broadcast.',
    fansCount: 1000,
    worksCount: 30,
    viewCount: 20,
    city: 'Health City',
    tags: ['dance', 'fitness', 'cooking']
  },
  {
    bloggerId: 5,
    bloggerName: 'Virtual anchor Bear',
    bloggerAvatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bear.jpg',
    introduction:
      'Hello everyone, I am the virtual host Xiaoxiong. A little wise man who likes movies, reading and philosophy, I hope to explore the meaning of life with you through live broadcast.',
    fansCount: 1200,
    worksCount: 25,
    viewCount: 18,
    city: 'City of Wisdom',
    tags: ['Movie', 'Literature']
  },
  {
    bloggerId: 6,
    bloggerName: 'Virtual anchor bird',
    bloggerAvatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bird.jpeg',
    introduction:
      'Hello everyone, I am the virtual anchor Xiaoniao. I like singing, acting and variety shows. I hope to be happy with everyone through the live broadcast.',
    fansCount: 900,
    worksCount: 12,
    viewCount: 8,
    city: 'Happy City',
    tags: ['music', 'performance', 'variety']
  }
]);
const customLayoutListTableColumnStyle = ref({ fontFamily: 'Arial', fontSize: 12, fontWeight: 'bold' });
onMounted(() => {
  // pivot tablt records
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_data.json')
    .then(res => res.json())
    .then(jsonData => {
      // update record
      pivotTableRecords.value = jsonData;
    });

  // pivot chart records
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_Chart_data.json')
    .then(res => res.json())
    .then(data => {
      // update record
      pivotChartRecords.value = data;
    });
});
</script>

<template>
  <div class="h-full">
    <NSpace vertical :size="16">
      <NCard title="List Table" :bordered="false" class="h-full w-2/3 card-wrapper">
        <ListTable ref="listTableRef" :options="{}" :records="listRecords" height="400px">
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
      </NCard>

      <NCard title="Pivot Table" :bordered="false" class="h-full w-2/3 card-wrapper">
        <PivotTable ref="pivotTableRef" :options="pivotTableOptions" :records="pivotTableRecords" height="400px">
          <PivotColumnDimension
            title="Category"
            dimension-key="Category"
            :header-style="{ textStick: true }"
            width="auto"
          />
          <PivotRowDimension
            v-for="(row, index) in pivotTableRows"
            :key="index"
            :dimension-key="row.dimensionKey"
            :title="row.title"
            :header-style="row.headerStyle"
            :width="row.width"
          />
          <PivotIndicator
            v-for="(indicator, index) in pivotTableIndicators"
            :key="index"
            :indicator-key="indicator.indicatorKey"
            :title="indicator.title"
            :width="indicator.width"
            :show-sort="indicator.showSort"
            :header-style="indicator.headerStyle"
            :format="indicator.format"
            :style="indicator.style"
          />
          <PivotCorner title-on-dimension="row" />
          <Menu menu-type="html" :context-menu-items="['copy', 'paste', 'delete', '...']" />
        </PivotTable>
      </NCard>

      <NCard title="Pivot Chart" :bordered="false" class="h-full w-2/3 card-wrapper">
        <PivotChart
          ref="pivotChartRef"
          :options="pivotChartOptions"
          :records="pivotChartRecords"
          height="800px"
          @on-legend-item-click="handleLegendItemClick"
        />
      </NCard>

      <NCard title="Custom Component" :bordered="false" class="h-full w-2/3 card-wrapper">
        <ListTable
          ref="customLayoutListTableRef"
          :options="customLayoutListTableOptions"
          :records="customLayoutListTableRecords"
          height="400px"
        >
          <!-- Order Number Column -->
          <ListColumn field="bloggerId" title="order number" width="100" />

          <!-- Anchor Nickname Column with Custom Layout -->
          <ListColumn field="bloggerName" title="anchor nickname" :width="330">
            <template #customLayout="{ record, height, width }">
              <Group :height="height" :width="width" display="flex" flex-direction="row" flex-wrap="nowrap">
                <!-- Avatar Group -->
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
                <!-- Blogger Info Group -->
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
                    <Image
                      id="location"
                      image="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/location.svg"
                      :width="15"
                      :height="15"
                      :bounds-padding="[0, 0, 0, 10]"
                      cursor="pointer"
                    />
                    <Text :text="record.city" :font-size="11" font-family="sans-serif" fill="#6f7070" />
                  </Group>
                  <!-- Tags Group -->
                  <Group
                    :height="height / 2"
                    :width="width - 60"
                    display="flex"
                    align-items="center"
                    fill="yellow"
                    :opacity="0.1"
                  >
                    <Tag
                      v-for="tag in record?.tags"
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

          <!-- Other Columns -->
          <ListColumn
            field="fansCount"
            title="Fans Count"
            width="120"
            :field-format="rec => rec.fansCount + 'w'"
            :style="customLayoutListTableColumnStyle"
          />
          <ListColumn field="worksCount" title="Works Count" :style="customLayoutListTableColumnStyle" width="135" />
          <ListColumn
            field="viewCount"
            title="View Count"
            width="120"
            :field-format="rec => rec.viewCount + 'w'"
            :style="customLayoutListTableColumnStyle"
          />
        </ListTable>
      </NCard>

      <NCard :bordered="false" class="h-full w-2/3 card-wrapper">
        <WebSiteLink label="More VTable Demos: " link="https://www.visactor.com/vtable/example" />
      </NCard>
    </NSpace>
  </div>
</template>
