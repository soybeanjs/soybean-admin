<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { SButtonIcon, SPopconfirm, usePaginatedTable } from '@vean/ui';
import type { TableColumn } from '@vean/ui';
import { filterValidQuery } from '@/shared/common';
import { defaultTableTransform } from '@/shared/table';
import { toPageQuery } from '@/service/api/manage-types';
import type { ManagePageQuery } from '@/service/api/manage-types';
import { batchDeletePermissions, deletePermission, fetchPermissionList } from '@/service/api/permission';
import type { PermissionRow } from '@/service/api/permission';
import { useTableOperate } from '@/composables/use-table-operate';
import EnabledTag from '@/components/enabled-tag/index.vue';
import ManagePage from '@/components/manage-page/index.vue';
import type { PermissionSearchFormDTO } from '@/schema/search';
import PermissionOperate from './modules/permission-operate.vue';
import PermissionSearch from './modules/permission-search.vue';

/**
 * 权限管理页（P3-03）。
 */
defineOptions({ name: 'ManagePermission' });

const { t } = useI18n();

/** 表格查询状态：分页字段 + 搜索字段（搜索的 `resourceType`/`enabled` 允许空串） */
type PermissionTableQuery = ManagePageQuery & PermissionSearchFormDTO;

const query = ref<PermissionTableQuery>({
  page: 1,
  pageSize: 10,
  sort: '-createdTime',
  name: '',
  code: '',
  resourceType: '',
  enabled: ''
});

const permissionColumns = computed<TableColumn<PermissionRow>[]>(() => [
  { type: 'selection' },
  { type: 'index', header: '#' },
  { accessorKey: 'enabled', header: t('manage.field.enabled') },
  { accessorKey: 'name', header: t('manage.permission.name') },
  { accessorKey: 'code', header: t('manage.permission.code') },
  { accessorKey: 'resourceType', header: t('manage.permission.resourceType') },
  { accessorKey: 'description', header: t('manage.field.description') },
  { accessorKey: 'updatedTime', header: t('manage.field.updatedTime') },
  { accessorKey: 'id', header: t('common.actions') }
]);

const { loading, tableData, columns, columnChecks, fetchData, page, pageSize, total } = usePaginatedTable({
  api: () => fetchPermissionList(toPageQuery(filterValidQuery(query.value))),
  transform: defaultTableTransform,
  columns: () => permissionColumns.value
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

function rowKey(row: PermissionRow) {
  return row.id;
}

function onSearch(values: PermissionSearchFormDTO) {
  void handleSearch(values);
}

function onReset() {
  void handleReset();
}

function onEdit(id: string) {
  handleEdit(id);
}

function resourceTypeLabel(type: PermissionRow['resourceType']) {
  if (type === 'menu') return t('manage.resourceType.menu');
  if (type === 'api') return t('manage.resourceType.api');
  if (type === 'button') return t('manage.resourceType.button');
  return t('manage.resourceType.other');
}

async function onDeleteConfirm(id: string) {
  await deletePermission(id);
  await onDeleted();
}

async function onBatchDelete() {
  await batchDeletePermissions(selected.value);
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
      <PermissionSearch :loading="loading" @search="onSearch" @reset="onReset" />
    </template>

    <template #enabled="{ value }">
      <EnabledTag :enabled="value" />
    </template>

    <template #resourceType="{ value }">
      {{ resourceTypeLabel(value) }}
    </template>

    <template #code="{ value }">
      <span class="block max-w-60 truncate">{{ value }}</span>
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

    <PermissionOperate v-model:open="operateOpen" :permission-id="operateId" @success="fetchData" />
  </ManagePage>
</template>
