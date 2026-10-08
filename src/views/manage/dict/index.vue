<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { SButton, SButtonIcon, SPopconfirm, usePaginatedTable } from '@vean/ui';
import type { TableColumn } from '@vean/ui';
import { filterValidQuery } from '@/shared/common';
import { defaultTableTransform } from '@/shared/table';
import { toPageQuery } from '@/service/api/manage-types';
import type { ManagePageQuery } from '@/service/api/manage-types';
import { batchDeleteDicts, deleteDict, fetchDictList } from '@/service/api/org-dict';
import type { DictRow } from '@/service/api/org-dict';
import { useTableOperate } from '@/composables/use-table-operate';
import EnabledTag from '@/components/enabled-tag/index.vue';
import ManagePage from '@/components/manage-page/index.vue';
import { getRouter } from '@/router/instance';
import type { DictSearchFormDTO } from '@/schema/search';
import DictOperate from './modules/dict-operate.vue';
import DictSearch from './modules/dict-search.vue';

/**
 * 字典管理页（P3-03）。
 *
 * 额外提供「查看字典项」跳转：`/manage/dict-item?dictId=<id>`，由字典项页读取
 * query 预置筛选，省去手抄 dictId。
 */
defineOptions({ name: 'ManageDict' });

const { t } = useI18n();

const query = ref<ManagePageQuery & DictSearchFormDTO>({
  page: 1,
  pageSize: 10,
  sort: '-createdTime',
  name: '',
  code: '',
  isSystem: ''
});

const dictColumns = computed<TableColumn<DictRow>[]>(() => [
  { type: 'selection' },
  { type: 'index', header: '#' },
  { accessorKey: 'enabled', header: t('manage.field.enabled') },
  { accessorKey: 'name', header: t('manage.dict.name') },
  { accessorKey: 'code', header: t('manage.dict.code') },
  { accessorKey: 'isSystem', header: t('manage.dict.isSystem') },
  { accessorKey: 'description', header: t('manage.field.description') },
  { accessorKey: 'updatedTime', header: t('manage.field.updatedTime') },
  { accessorKey: 'id', header: t('common.actions') }
]);

const { loading, tableData, columns, columnChecks, fetchData, page, pageSize, total } = usePaginatedTable({
  api: () => fetchDictList(toPageQuery(filterValidQuery(query.value))),
  transform: defaultTableTransform,
  columns: () => dictColumns.value
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

function rowKey(row: DictRow) {
  return row.id;
}

function onSearch(values: DictSearchFormDTO) {
  void handleSearch(values);
}

function onReset() {
  void handleReset();
}

function onEdit(id: string) {
  handleEdit(id);
}

function isSystemLabel(value: DictRow['isSystem']) {
  return value === 'Y' ? t('common.yes') : t('common.no');
}

/** 跳转到字典项页并预置 dictId 筛选 */
function onViewItems(id: string) {
  void getRouter().push({ path: '/manage/dict-item', query: { dictId: id } });
}

async function onDeleteConfirm(id: string) {
  await deleteDict(id);
  await onDeleted();
}

async function onBatchDelete() {
  await batchDeleteDicts(selected.value);
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
      <DictSearch :loading="loading" @search="onSearch" @reset="onReset" />
    </template>

    <template #enabled="{ value }">
      <EnabledTag :enabled="value" />
    </template>

    <template #isSystem="{ value }">
      {{ isSystemLabel(value) }}
    </template>

    <template #description="{ value }">
      <span class="block max-w-60 truncate">{{ value || '-' }}</span>
    </template>

    <template #id="{ row }">
      <div class="flex items-center justify-center gap-1">
        <SButton variant="ghost" size="sm" @click="onViewItems(row.id)">
          {{ t('manage.viewDictItems') }}
        </SButton>
        <SButtonIcon icon="lucide:pencil" variant="ghost" size="sm" @click="onEdit(row.id)" />
        <SPopconfirm :title="t('common.deleteConfirm')" @confirm="onDeleteConfirm(row.id)">
          <SButtonIcon icon="lucide:trash-2" variant="ghost" size="sm" color="destructive" />
        </SPopconfirm>
      </div>
    </template>

    <DictOperate v-model:open="operateOpen" :dict-id="operateId" @success="fetchData" />
  </ManagePage>
</template>
