<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { SButtonIcon, SPopconfirm, usePaginatedTable } from '@vean/ui';
import type { TableColumn } from '@vean/ui';
import { filterValidQuery } from '@/shared/common';
import { defaultTableTransform } from '@/shared/table';
import { toPageQuery } from '@/service/api/manage-types';
import type { ManagePageQuery } from '@/service/api/manage-types';
import { batchDeleteRoles, deleteRole, fetchRoleList } from '@/service/api/role';
import type { RoleRow } from '@/service/api/role';
import { useTableOperate } from '@/composables/use-table-operate';
import EnabledTag from '@/components/enabled-tag/index.vue';
import ManagePage from '@/components/manage-page/index.vue';
import type { RoleSearchFormDTO } from '@/schema/search';
import RoleOperate from './modules/role-operate.vue';
import RoleSearch from './modules/role-search.vue';

/**
 * 角色管理页（P3-03）。
 */
defineOptions({ name: 'ManageRole' });

const { t } = useI18n();

/** 表格查询状态：分页字段 + 搜索字段（搜索的 `enabled` 允许空串 = 全部） */
type RoleTableQuery = ManagePageQuery & RoleSearchFormDTO;

const query = ref<RoleTableQuery>({
  page: 1,
  pageSize: 10,
  sort: '-createdTime',
  name: '',
  code: '',
  enabled: ''
});

const roleColumns = computed<TableColumn<RoleRow>[]>(() => [
  { type: 'selection' },
  { type: 'index', header: '#' },
  { accessorKey: 'enabled', header: t('manage.field.enabled') },
  { accessorKey: 'name', header: t('manage.role.name') },
  { accessorKey: 'code', header: t('manage.role.code') },
  { accessorKey: 'userCount', header: t('manage.role.userCount') },
  { accessorKey: 'description', header: t('manage.field.description') },
  { accessorKey: 'updatedTime', header: t('manage.field.updatedTime') },
  { accessorKey: 'id', header: t('common.actions') }
]);

const { loading, tableData, columns, columnChecks, fetchData, page, pageSize, total } = usePaginatedTable({
  api: () => fetchRoleList(toPageQuery(filterValidQuery(query.value))),
  transform: defaultTableTransform,
  columns: () => roleColumns.value
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

function rowKey(row: RoleRow) {
  return row.id;
}

function onSearch(values: RoleSearchFormDTO) {
  void handleSearch(values);
}

function onReset() {
  void handleReset();
}

function onEdit(id: string) {
  handleEdit(id);
}

async function onDeleteConfirm(id: string) {
  await deleteRole(id);
  await onDeleted();
}

async function onBatchDelete() {
  await batchDeleteRoles(selected.value);
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
      <RoleSearch :loading="loading" @search="onSearch" @reset="onReset" />
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

    <RoleOperate v-model:open="operateOpen" :role-id="operateId" @success="fetchData" />
  </ManagePage>
</template>
