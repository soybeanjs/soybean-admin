<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { SButtonIcon, SPopconfirm, usePaginatedTable } from '@vean/ui';
import type { TableColumn } from '@vean/ui';
import { filterValidQuery } from '@/shared/common';
import { defaultTableTransform, toPageQuery } from '@/shared/table';
import { useTableOperate } from '@/composables/use-table-operate';
import type { ManagePageQuery } from '@/composables/use-table-operate';
import EnabledTag from '@/components/enabled-tag/index.vue';
import ManagePage from '@/components/manage-page/index.vue';
import { api, flatApi } from '@/request';
import type { ApiResource, ApiSearchFormDTO } from '@/schema/api';
import ApiOperate from './modules/api-operate.vue';
import ApiSearch from './modules/api-search.vue';

/** 职责分层： 详见 docs/v3-notes.md N-316。 */
defineOptions({ name: 'ManageApi' });

const { t } = useI18n();

/** 表格查询状态：`page`/`pageSize` 由 `useTableOperate` 同步，其余是搜索条件 */
const query = ref<ManagePageQuery & ApiSearchFormDTO>({
  page: 1,
  pageSize: 10,
  sort: '-createdTime',
  name: '',
  path: '',
  method: ''
});

/** 列定义用 `computed`：`header` 是 `t()` 的结果，切语言要重算 */
const apiColumns = computed<TableColumn<ApiResource>[]>(() => [
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
  api: async () => (await flatApi.get('/api/list', { query: { ...toPageQuery(filterValidQuery(query.value)) } })).data,
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

function rowKey(row: ApiResource) {
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
  await api.delete('/api/{id}', { pathParams: { id } });
  await onDeleted();
}

async function onBatchDelete() {
  await api.post('/api/batch-delete', { body: { ids: selected.value } });
  await onBatchDeleted();
}

definePage({
  meta: {
    title: '接口管理',
    i18nKey: 'route.manageApi',
    icon: 'mdi:api',
    order: 10
  }
});
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
