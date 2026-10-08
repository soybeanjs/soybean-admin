<script setup lang="ts" generic="Item extends TableBaseData">
import { computed, useSlots } from 'vue';
import { useI18n } from 'vue-i18n';
import { SCard, SPagination, SSelect, STable } from '@vean/ui';
import type { TableBaseData, TableColumn, TableColumnCheck } from '@vean/ui';
import { usePageSizeOptions } from '@/composables/use-table-operate';
import TableHeaderOperation from '@/components/table-header-operation/index.vue';

/**
 * manage 页统一外壳（P3-03，v3 §4.6「统一范式」）。
 *
 * 8 套 CRUD 页的骨架完全同形：搜索卡 → 列表卡（表头操作 + 表格 + 分页）→
 * operate 弹窗。把骨架收敛到这里，页面只留「列定义 + 字段单元格 + 弹窗」，
 * 避免 8 份几乎逐字相同的模板漂移。
 *
 * 插槽：
 * - `search`   搜索卡（各域字段不同，由页面提供）
 * - `toolbar`  表头操作区左侧附加按钮
 * - `suffix`   表头操作区最右侧附加内容
 * - 其余具名插槽（`#name` / `#enabled` / …）原样转发给 `STable` 的单元格插槽
 */
defineOptions({ name: 'ManagePage' });

const props = withDefaults(
  defineProps<{
    /** 列表卡标题 */
    title: string;
    /** 数据拉取中 */
    loading: boolean;
    /** 刷新按钮转圈（比 `loading` 晚 500ms 收起，避免闪一下） */
    refreshLoading?: boolean;
    /** 列定义（来自 `usePaginatedTable`） */
    columns: TableColumn<Item>[];
    /** 表格数据（来自 `usePaginatedTable`） */
    data: Item[];
    /** 总条数 */
    total: number;
    /** 行 key 取值（本仓 8 套 CRUD 均为 uuid 字符串） */
    rowKey: (row: Item) => string;
  }>(),
  { refreshLoading: false }
);

const emit = defineEmits<{
  add: [];
  delete: [];
  refresh: [];
}>();
/** 当前页（`usePaginatedTable` 的 `page`） */
const page = defineModel<number>('page', { required: true });
/** 每页条数 */
const pageSize = defineModel<number>('pageSize', { required: true });
/** 列检查表（`usePaginatedTable` 的 `columnChecks`，表头操作区内置列设置） */
const columnChecks = defineModel<TableColumnCheck[]>('columnChecks', { required: true });
/** 多选选中 id（`useTableOperate` 的 `selected`） */
const selected = defineModel<string[]>('selected', { default: () => [] });

const { t } = useI18n();
const { pageSizeOptions } = usePageSizeOptions();
const slots = useSlots();

/** 需要原样转发给 `STable` 的插槽（剔除本组件自有插槽） */
const tableSlots = computed(() =>
  Object.keys(slots).filter(name => name !== 'search' && name !== 'toolbar' && name !== 'suffix')
);

function onAdd() {
  emit('add');
}

function onBatchDelete() {
  emit('delete');
}

function onRefresh() {
  emit('refresh');
}
</script>

<template>
  <div class="h-full min-h-125 flex-c-stretch gap-4 overflow-hidden lt-sm:overflow-auto">
    <slot name="search" />

    <SCard :title="props.title" :ui="{ content: 'flex-c-stretch' }" class="flex-1-hidden">
      <template #extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :loading="props.refreshLoading"
          :disabled-delete="selected.length === 0"
          :delete-count="selected.length"
          @add="onAdd"
          @delete="onBatchDelete"
          @refresh="onRefresh"
        >
          <slot name="toolbar" />
          <template #suffix>
            <slot name="suffix" />
          </template>
        </TableHeaderOperation>
      </template>

      <div :class="{ 'pointer-events-none opacity-60': props.loading }" class="shrink-0">
        <STable :columns="props.columns" :data="props.data" :row-key="props.rowKey" class="grow-0 shrink-1">
          <template v-for="name in tableSlots" :key="name" #[name]="slotProps">
            <slot :name="name" v-bind="slotProps ?? {}" />
          </template>
        </STable>
      </div>

      <SPagination
        v-model:page="page"
        v-model:page-size="pageSize"
        :total="props.total"
        :disabled="props.loading"
        :show-first-or-last="false"
        action-as-selected
        class="h-12 flex-y-center justify-end gap-4 pt-3"
      >
        <template #leading>
          <span class="text-sm opacity-70">{{ t('manage.total', { count: props.total }) }}</span>
        </template>
        <template #trailing>
          <SSelect v-model="pageSize" :items="pageSizeOptions" class="w-30" />
        </template>
      </SPagination>
    </SCard>
  </div>
</template>
