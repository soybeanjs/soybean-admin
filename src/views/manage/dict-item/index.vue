<script setup lang="ts">
import { computed, onMounted, ref, shallowRef } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { SButton, SButtonIcon, SPopconfirm, usePaginatedTable } from '@vean/ui';
import type { TableColumn } from '@vean/ui';
import { filterValidQuery } from '@/shared/common';
import { defaultTableTransform } from '@/shared/table';
import { toPageQuery } from '@/service/api/manage-types';
import type { ManagePageQuery } from '@/service/api/manage-types';
import { batchDeleteDictItems, deleteDictItem, fetchAllDicts, fetchDictItemList } from '@/service/api/org-dict';
import type { DictItemRow } from '@/service/api/org-dict';
import type { SelectOption } from '@/composables/use-manage-options';
import { useTableOperate } from '@/composables/use-table-operate';
import EnabledTag from '@/components/enabled-tag/index.vue';
import ManagePage from '@/components/manage-page/index.vue';
import type { DictItemSearchFormDTO } from '@/schema/search';
import DictItemOperate from './modules/dict-item-operate.vue';
import DictItemSearch from './modules/dict-item-search.vue';

/**
 * 字典项管理页（P3-03）。
 *
 * 支持 `?dictId=<id>` 预置筛选（字典页的「查看字典项」入口）。`dictId` 列只存
 * id，需要一份 `GET /api/dict/all` 的 id → 名称映射。
 */
defineOptions({ name: 'ManageDictItem' });

const { t } = useI18n();
const route = useRoute();

/** 字典页「查看字典项」跳转时带上的预置筛选 */
const initialDictId = computed(() => (typeof route.query.dictId === 'string' ? route.query.dictId : ''));

const query = ref<ManagePageQuery & DictItemSearchFormDTO>({
  page: 1,
  pageSize: 10,
  sort: '-createdTime',
  dictId: '',
  label: '',
  value: ''
});

const dictOptions = shallowRef<SelectOption[]>([]);

const dictNameMap = computed(() => new Map(dictOptions.value.map(option => [option.value, option.label])));

const dictItemColumns = computed<TableColumn<DictItemRow>[]>(() => [
  { type: 'selection' },
  { type: 'index', header: '#' },
  { accessorKey: 'enabled', header: t('manage.field.enabled') },
  { accessorKey: 'dictId', header: t('manage.dictItem.dictId') },
  { accessorKey: 'label', header: t('manage.dictItem.label') },
  { accessorKey: 'value', header: t('manage.dictItem.value') },
  { accessorKey: 'order', header: t('manage.field.order') },
  { accessorKey: 'updatedTime', header: t('manage.field.updatedTime') },
  { accessorKey: 'id', header: t('common.actions') }
]);

const { loading, tableData, columns, columnChecks, fetchData, page, pageSize, total } = usePaginatedTable({
  api: () => fetchDictItemList(toPageQuery(filterValidQuery(query.value))),
  transform: defaultTableTransform,
  columns: () => dictItemColumns.value
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

function rowKey(row: DictItemRow) {
  return row.id;
}

function onSearch(values: DictItemSearchFormDTO) {
  void handleSearch(values);
}

function onReset() {
  void handleReset();
}

function onEdit(id: string) {
  handleEdit(id);
}

function dictLabel(id: string) {
  return dictNameMap.value.get(id) ?? id;
}

function onViewDict() {
  void window.open('/manage/dict', '_self');
}

async function onDeleteConfirm(id: string) {
  await deleteDictItem(id);
  await onDeleted();
}

async function onBatchDelete() {
  await batchDeleteDictItems(selected.value);
  await onBatchDeleted();
}

async function loadDictOptions(): Promise<void> {
  const rows = await fetchAllDicts();

  dictOptions.value = rows.map(row => ({ value: row.id, label: row.name }));
}

onMounted(() => {
  query.value.dictId = initialDictId.value;

  void loadDictOptions();
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
      <DictItemSearch
        :loading="loading"
        :dict-options="dictOptions"
        :initial-dict-id="initialDictId"
        @search="onSearch"
        @reset="onReset"
      />
    </template>

    <template #toolbar>
      <SButton variant="outline" size="sm" @click="onViewDict">{{ t('manage.dict.name') }}</SButton>
    </template>

    <template #enabled="{ value }">
      <EnabledTag :enabled="value" />
    </template>

    <template #dictId="{ value }">
      {{ dictLabel(value) }}
    </template>

    <template #id="{ row }">
      <div class="flex items-center justify-center gap-1">
        <SButtonIcon icon="lucide:pencil" variant="ghost" size="sm" @click="onEdit(row.id)" />
        <SPopconfirm :title="t('common.deleteConfirm')" @confirm="onDeleteConfirm(row.id)">
          <SButtonIcon icon="lucide:trash-2" variant="ghost" size="sm" color="destructive" />
        </SPopconfirm>
      </div>
    </template>

    <DictItemOperate
      v-model:open="operateOpen"
      :dict-item-id="operateId"
      :dict-options="dictOptions"
      @success="fetchData"
    />
  </ManagePage>
</template>
