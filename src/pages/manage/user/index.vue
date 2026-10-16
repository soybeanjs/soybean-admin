<script setup lang="ts">
import { computed, onMounted, ref, shallowRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { SButtonIcon, SPopconfirm, STag, usePaginatedTable } from '@vean/ui';
import type { TableColumn } from '@vean/ui';
import { filterValidQuery } from '@/shared/common';
import { defaultTableTransform, toPageQuery } from '@/shared/table';
import { useTableOperate } from '@/composables/use-table-operate';
import type { ManagePageQuery } from '@/composables/use-table-operate';
import EnabledTag from '@/components/enabled-tag/index.vue';
import ManagePage from '@/components/manage-page/index.vue';
import { api, flatApi } from '@/request';
import type { UserRowOutput, UserSearchFormDTO } from '@/schema/user';
import UserOperate from './modules/user-operate.vue';
import UserSearch from './modules/user-search.vue';

/** 与 `src/pages/manage/api/index.vue` 同范式，差异： 详见 docs/v3-notes.md N-330。 */
defineOptions({ name: 'ManageUser' });

const { t } = useI18n();

/** 表格查询状态：分页字段（`ManagePageQuery`）+ 搜索字段（`UserSearchFormDTO`） 详见 docs/v3-notes.md N-331。 */
type UserTableQuery = ManagePageQuery & UserSearchFormDTO;

const query = ref<UserTableQuery>({
  page: 1,
  pageSize: 10,
  sort: '-createdTime',
  username: '',
  phone: '',
  email: '',
  fullName: '',
  enabled: ''
});

/** 角色 id → 名称（`roles` 列只有 id） */
const roleNameMap = shallowRef<Map<string, string>>(new Map());

/** 当前编辑行的角色 id（列表行才有，详情接口不返回） */
const editingRoleIds = shallowRef<string[]>([]);

const userColumns = computed<TableColumn<UserRowOutput>[]>(() => [
  { type: 'selection' },
  { type: 'index', header: '#' },
  { accessorKey: 'enabled', header: t('manage.field.enabled') },
  { accessorKey: 'username', header: t('manage.user.username') },
  { accessorKey: 'fullName', header: t('manage.user.fullName') },
  { accessorKey: 'phone', header: t('manage.user.phone') },
  { accessorKey: 'email', header: t('manage.user.email') },
  { accessorKey: 'roles', header: t('manage.user.roleIds') },
  { accessorKey: 'homePath', header: t('manage.user.homePath') },
  { accessorKey: 'id', header: t('common.actions') }
]);

const { loading, tableData, columns, columnChecks, fetchData, page, pageSize, total } = usePaginatedTable({
  api: async () => (await flatApi.get('/user/list', { query: { ...toPageQuery(filterValidQuery(query.value)) } })).data,
  transform: defaultTableTransform,
  columns: () => userColumns.value
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

function rowKey(row: UserRowOutput) {
  return row.id;
}

function onSearch(values: UserSearchFormDTO) {
  void handleSearch(values);
}

function onReset() {
  void handleReset();
}

function onEdit(row: UserRowOutput) {
  editingRoleIds.value = row.roles.map(role => role.id);
  handleEdit(row.id);
}

function onAdd() {
  editingRoleIds.value = [];
  handleAdd();
}

function roleLabel(id: string) {
  return roleNameMap.value.get(id) ?? id;
}

async function onDeleteConfirm(id: string) {
  await api.delete('/user/{id}', { pathParams: { id } });
  await onDeleted();
}

async function onBatchDelete() {
  await api.post('/user/batch-delete', { body: { ids: selected.value } });
  await onBatchDeleted();
}

async function loadRoleNameMap(): Promise<void> {
  const roles = await api.get('/role/all');

  roleNameMap.value = new Map((roles ?? []).map(role => [role.id, role.name]));
}

onMounted(() => {
  void loadRoleNameMap();
});

definePage({
  meta: {
    title: '用户管理',
    i18nKey: 'route.manageUser',
    icon: 'mdi:account',
    order: 11
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
    @add="onAdd"
    @delete="onBatchDelete"
    @refresh="fetchData"
  >
    <template #search>
      <UserSearch :loading="loading" @search="onSearch" @reset="onReset" />
    </template>

    <template #enabled="{ value }">
      <EnabledTag :enabled="value" />
    </template>

    <template #fullName="{ value }">
      {{ value || '-' }}
    </template>

    <template #phone="{ value }">
      {{ value || '-' }}
    </template>

    <template #email="{ value }">
      {{ value || '-' }}
    </template>

    <template #roles="{ value }">
      <div class="flex flex-wrap gap-1">
        <STag v-for="role in value" :key="role.id" variant="soft" color="primary">
          {{ roleLabel(role.id) }}
        </STag>
        <span v-if="!value.length" class="text-slate-400">-</span>
      </div>
    </template>

    <template #homePath="{ value }">
      {{ value || '-' }}
    </template>

    <template #id="{ row }">
      <div class="flex items-center justify-center gap-1">
        <SButtonIcon icon="lucide:pencil" variant="ghost" size="sm" @click="onEdit(row)" />
        <SPopconfirm :title="t('common.deleteConfirm')" @confirm="onDeleteConfirm(row.id)">
          <SButtonIcon icon="lucide:trash-2" variant="ghost" size="sm" color="destructive" />
        </SPopconfirm>
      </div>
    </template>

    <UserOperate v-model:open="operateOpen" :user-id="operateId" :role-ids="editingRoleIds" @success="fetchData" />
  </ManagePage>
</template>
