<script setup lang="ts">
import { computed, onMounted, ref, shallowRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { SButtonIcon, SPopconfirm, usePaginatedTable } from '@vean/ui';
import type { TableColumn } from '@vean/ui';
import { filterValidQuery } from '@/shared/common';
import { defaultTableTransform } from '@/shared/table';
import { toPageQuery } from '@/service/api/manage-types';
import type { ManagePageQuery } from '@/service/api/manage-types';
import { batchDeleteOrgs, deleteOrg, fetchAllOrgs, fetchOrgList } from '@/service/api/org-dict';
import type { OrgRow } from '@/service/api/org-dict';
import type { SelectOption } from '@/composables/use-manage-options';
import { useTableOperate } from '@/composables/use-table-operate';
import EnabledTag from '@/components/enabled-tag/index.vue';
import ManagePage from '@/components/manage-page/index.vue';
import type { OrgSearchFormDTO } from '@/schema/search';
import OrgOperate from './modules/org-operate.vue';
import OrgSearch from './modules/org-search.vue';

/**
 * 组织管理页（P3-03）。
 *
 * `parentId` 列只存 id，需要一份 `GET /api/org/all` 的 id → 名称映射；同一份
 * 列表也传给 `OrgOperate` 做父级候选。
 */
defineOptions({ name: 'ManageOrg' });

const { t } = useI18n();

const query = ref<ManagePageQuery & OrgSearchFormDTO>({
  page: 1,
  pageSize: 10,
  sort: '-createdTime',
  name: '',
  code: ''
});

const allOrgs = shallowRef<OrgRow[]>([]);

const orgNameMap = computed(() => new Map(allOrgs.value.map(org => [org.id, org.name])));
const orgOptions = computed<SelectOption[]>(() => allOrgs.value.map(org => ({ value: org.id, label: org.name })));

const orgColumns = computed<TableColumn<OrgRow>[]>(() => [
  { type: 'selection' },
  { type: 'index', header: '#' },
  { accessorKey: 'enabled', header: t('manage.field.enabled') },
  { accessorKey: 'name', header: t('manage.org.name') },
  { accessorKey: 'code', header: t('manage.org.code') },
  { accessorKey: 'parentId', header: t('manage.field.parentId') },
  { accessorKey: 'description', header: t('manage.field.description') },
  { accessorKey: 'updatedTime', header: t('manage.field.updatedTime') },
  { accessorKey: 'id', header: t('common.actions') }
]);

const { loading, tableData, columns, columnChecks, fetchData, page, pageSize, total } = usePaginatedTable({
  api: () => fetchOrgList(toPageQuery(filterValidQuery(query.value))),
  transform: defaultTableTransform,
  columns: () => orgColumns.value
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

function rowKey(row: OrgRow) {
  return row.id;
}

function onSearch(values: OrgSearchFormDTO) {
  void handleSearch(values);
}

function onReset() {
  void handleReset();
}

function onEdit(id: string) {
  handleEdit(id);
}

function parentLabel(id: OrgRow['parentId']) {
  if (!id) {
    return t('manage.noParent');
  }

  return orgNameMap.value.get(id) ?? id;
}

async function onDeleteConfirm(id: string) {
  await deleteOrg(id);
  await onDeleted();
}

async function onBatchDelete() {
  await batchDeleteOrgs(selected.value);
  await onBatchDeleted();
}

async function loadAllOrgs(): Promise<void> {
  allOrgs.value = await fetchAllOrgs();
}

onMounted(() => {
  void loadAllOrgs();
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
      <OrgSearch :loading="loading" @search="onSearch" @reset="onReset" />
    </template>

    <template #enabled="{ value }">
      <EnabledTag :enabled="value" />
    </template>

    <template #parentId="{ value }">
      {{ parentLabel(value) }}
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

    <OrgOperate v-model:open="operateOpen" :org-id="operateId" :orgs="orgOptions" @success="fetchData" />
  </ManagePage>
</template>
