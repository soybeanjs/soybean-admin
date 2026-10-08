<script setup lang="ts">
import { computed, onMounted, ref, shallowRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { SButtonIcon, SPopconfirm, usePaginatedTable } from '@vean/ui';
import type { TableColumn } from '@vean/ui';
import { filterValidQuery } from '@/shared/common';
import { defaultTableTransform } from '@/shared/table';
import { toPageQuery } from '@/service/api/manage-types';
import type { ManagePageQuery } from '@/service/api/manage-types';
import { batchDeleteMenus, deleteMenu, fetchAllMenus, fetchMenuList } from '@/service/api/menu-manage';
import type { MenuRow } from '@/service/api/menu-manage';
import { useTableOperate } from '@/composables/use-table-operate';
import EnabledTag from '@/components/enabled-tag/index.vue';
import ManagePage from '@/components/manage-page/index.vue';
import type { MenuSearchFormDTO } from '@/schema/search';
import MenuOperate from './modules/menu-operate.vue';
import MenuSearch from './modules/menu-search.vue';

/**
 * 菜单管理页（P3-03）。
 *
 * `parentId` 列只存 id，需要一份 `GET /api/menu/all` 的 id → 名称映射才能显示；
 * 同一份全量列表也传给 `MenuOperate` 做父级选择与组件名候选。
 */
defineOptions({ name: 'ManageMenu' });

const { t } = useI18n();

/** 表格查询状态：分页字段 + 搜索字段（搜索的 `menuType`/`enabled` 允许空串 = 全部） */
type MenuTableQuery = ManagePageQuery & MenuSearchFormDTO;

const query = ref<MenuTableQuery>({
  page: 1,
  pageSize: 10,
  sort: '-createdTime',
  name: '',
  code: '',
  menuType: '',
  enabled: ''
});

/** 全量菜单（父级名称映射 + 弹窗候选） */
const allMenus = shallowRef<MenuRow[]>([]);

const menuNameMap = computed(() => new Map(allMenus.value.map(menu => [menu.id, menu.name])));

const menuColumns = computed<TableColumn<MenuRow>[]>(() => [
  { type: 'selection' },
  { type: 'index', header: '#' },
  { accessorKey: 'enabled', header: t('manage.field.enabled') },
  { accessorKey: 'name', header: t('manage.menu.name') },
  { accessorKey: 'code', header: t('manage.menu.code') },
  { accessorKey: 'menuType', header: t('manage.menu.menuType') },
  { accessorKey: 'parentId', header: t('manage.field.parentId') },
  { accessorKey: 'routePath', header: t('manage.menu.routePath') },
  { accessorKey: 'routeName', header: t('manage.menu.routeName') },
  { accessorKey: 'requiresAuth', header: t('manage.menu.requiresAuth') },
  { accessorKey: 'keepAlive', header: t('manage.menu.keepAlive') },
  { accessorKey: 'multiTab', header: t('manage.menu.multiTab') },
  { accessorKey: 'pinned', header: t('manage.menu.pinned') },
  { accessorKey: 'id', header: t('common.actions') }
]);

const { loading, tableData, columns, columnChecks, fetchData, page, pageSize, total } = usePaginatedTable({
  api: () => fetchMenuList(toPageQuery(filterValidQuery(query.value))),
  transform: defaultTableTransform,
  columns: () => menuColumns.value
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

function rowKey(row: MenuRow) {
  return row.id;
}

function onSearch(values: MenuSearchFormDTO) {
  void handleSearch(values);
}

function onReset() {
  void handleReset();
}

function onEdit(id: string) {
  handleEdit(id);
}

function menuTypeLabel(type: MenuRow['menuType']) {
  if (type === 'directory') return t('manage.menuType.directory');
  if (type === 'menu') return t('manage.menuType.menu');
  if (type === 'page') return t('manage.menuType.page');
  if (type === 'iframe') return t('manage.menuType.iframe');
  if (type === 'link') return t('manage.menuType.link');
  if (type === 'button') return t('manage.menuType.button');
  return t('manage.menuType.other');
}

function yesOrNoLabel(value: MenuRow['requiresAuth']) {
  return value === 'Y' ? t('common.yes') : t('common.no');
}

function parentLabel(id: MenuRow['parentId']) {
  if (!id) {
    return t('manage.noParent');
  }

  return menuNameMap.value.get(id) ?? id;
}

async function onDeleteConfirm(id: string) {
  await deleteMenu(id);
  await onDeleted();
}

async function onBatchDelete() {
  await batchDeleteMenus(selected.value);
  await onBatchDeleted();
}

async function loadAllMenus(): Promise<void> {
  allMenus.value = await fetchAllMenus();
}

onMounted(() => {
  void loadAllMenus();
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
      <MenuSearch :loading="loading" @search="onSearch" @reset="onReset" />
    </template>

    <template #enabled="{ value }">
      <EnabledTag :enabled="value" />
    </template>

    <template #menuType="{ value }">
      {{ menuTypeLabel(value) }}
    </template>

    <template #parentId="{ value }">
      {{ parentLabel(value) }}
    </template>

    <template #routePath="{ value }">
      <span class="block max-w-50 truncate">{{ value || '-' }}</span>
    </template>

    <template #routeName="{ value }">
      {{ value || '-' }}
    </template>

    <template #requiresAuth="{ value }">
      {{ yesOrNoLabel(value) }}
    </template>

    <template #keepAlive="{ value }">
      {{ yesOrNoLabel(value) }}
    </template>

    <template #multiTab="{ value }">
      {{ yesOrNoLabel(value) }}
    </template>

    <template #pinned="{ value }">
      {{ yesOrNoLabel(value) }}
    </template>

    <template #id="{ row }">
      <div class="flex items-center justify-center gap-1">
        <SButtonIcon icon="lucide:pencil" variant="ghost" size="sm" @click="onEdit(row.id)" />
        <SPopconfirm :title="t('common.deleteConfirm')" @confirm="onDeleteConfirm(row.id)">
          <SButtonIcon icon="lucide:trash-2" variant="ghost" size="sm" color="destructive" />
        </SPopconfirm>
      </div>
    </template>

    <MenuOperate v-model:open="operateOpen" :menu-id="operateId" :menus="allMenus" @success="fetchData" />
  </ManagePage>
</template>
