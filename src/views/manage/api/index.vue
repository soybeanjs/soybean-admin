<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { SButtonIcon, SPopconfirm, usePaginatedTable } from '@vean/ui';
import type { TableColumn } from '@vean/ui';
import { filterValidQuery } from '@/shared/common';
import { defaultTableTransform } from '@/shared/table';
import { batchDeleteApis, deleteApi, fetchApiList } from '@/service/api/api';
import type { ApiQuery, ApiRow } from '@/service/api/api';
import { toPageQuery } from '@/service/api/manage-types';
import { useTableOperate } from '@/composables/use-table-operate';
import EnabledTag from '@/components/enabled-tag/index.vue';
import ManagePage from '@/components/manage-page/index.vue';
import type { ApiSearchFormDTO } from '@/schema/search';
import ApiOperate from './modules/api-operate.vue';
import ApiSearch from './modules/api-search.vue';

/**
 * 接口管理页（P3-03，8 套 CRUD 的**参照实现**）。
 *
 * 职责分层：
 * - `usePaginatedTable`（`@vean/ui`）：数据与分页；
 * - `useTableOperate`：交互状态（弹窗 id、多选、搜索/重置/刷新）；
 * - `ManagePage`：骨架（搜索卡槽位 / 表头操作 / 表格 / 分页）；
 * - `ApiSearch` + `ApiOperate`：本域字段。
 *
 * 复用到其他域时只需改：`query` 字段、`api` 回调、列定义、两个子组件。
 */
defineOptions({ name: 'ManageApi' });

const { t } = useI18n();

/** 表格查询状态：`page`/`pageSize` 由 `useTableOperate` 同步，其余是搜索条件 */
const query = ref<ApiQuery>({ page: 1, pageSize: 10, sort: '-createdTime', name: '', path: '', method: '' });

/** 列定义用 `computed`：`header` 是 `t()` 的结果，切语言要重算 */
const apiColumns = computed<TableColumn<ApiRow>[]>(() => [
  { type: 'selection' },
  { type: 'index', header: '#' },
  { accessorKey: 'name', header: t('manage.api.name') },
  { accessorKey: 'path', header: t('manage.api.path') },
  { accessorKey: 'method', header: t('manage.api.method') },
  { accessorKey: 'enabled', header: t('manage.field.enabled') },
  { accessorKey: 'description', header: t('manage.field.description') },
  { accessorKey: 'updatedTime', header: t('manage.field.updatedTime') },
  { accessorKey: 'id', header: t('common.actions') }
]);

const { loading, tableData, columns, columnChecks, fetchData, page, pageSize, total } = usePaginatedTable({
  api: () => fetchApiList(toPageQuery(filterValidQuery(query.value))),
  transform: defaultTableTransform,
  columns: () => apiColumns.value
});

const {
  operateId,
  operateOpen,
  selected,
  refreshLoading,
  handleAdd,
  handleEdit,
  handleReset,
  handleSearch,
  onDeleted,
  onBatchDeleted
} = useTableOperate({
  query,
  page,
  pageSize,
  fetchData,
  loading,
  messages: { deleted: t('common.deleteSuccess'), batchDeleted: t('common.batchDeleteSuccess') }
});

function rowKey(row: ApiRow) {
  return row.id;
}

function onSearch(values: ApiSearchFormDTO) {
  void handleSearch(values);
}

function onReset() {
  void handleReset();
}

function onEdit(id: string) {
  handleEdit(id);
}

async function onDeleteConfirm(id: string) {
  await deleteApi(id);
  await onDeleted();
}

async function onBatchDelete() {
  await batchDeleteApis(selected.value);
  await onBatchDeleted();
}
</script>

<template>
  <ManagePage
    v-model:page="page"
    v-model:page-size="pageSize"
    v-model:column-checks="columnChecks"
    v-model:selected="selected"
    :title="t('manage.list')"
    :loading="loading"
    :refresh-loading="refreshLoading"
    :columns="columns"
    :data="tableData"
    :total="total"
    :row-key="rowKey"
    @add="handleAdd"
    @delete="onBatchDelete"
    @refresh="fetchData"
  >
    <template #search>
      <ApiSearch :loading="loading" @search="onSearch" @reset="onReset" />
    </template>

    <template #enabled="{ value }">
      <EnabledTag :enabled="value" />
    </template>

    <template #description="{ value }">
      <span class="block max-w-60 truncate">{{ value || '-' }}</span>
    </template>

    <template #id="{ row }">
      <div class="flex items-center justify-center gap-1">
        <SButtonIcon icon="lucide:pencil" variant="ghost" size="sm" @click="onEdit(row.id)" />
        <SPopconfirm :title="t('common.deleteConfirm')" @confirm="onDeleteConfirm(row.id)">
          <SButtonIcon icon="lucide:trash-2" variant="ghost" size="sm" color="destructive" />
        </SPopconfirm>
      </div>
    </template>

    <ApiOperate v-model:open="operateOpen" :api-id="operateId" @success="fetchData" />
  </ManagePage>
</template>
