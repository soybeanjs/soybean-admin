<script setup lang="tsx">
import { computed, ref } from 'vue';
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import type { PaginationProps } from 'naive-ui';
import { useBoolean } from '@sa/hooks';
import { fetchGetRoleList } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { useTable } from '@/hooks/common/table';
import { $t } from '@/locales';
import { enableStatusRecord } from '@/constants/business';
import RoleOperateDrawer, { type OperateType } from './modules/role-operate-drawer.vue';
import RoleSearch from './modules/role-search.vue';

const appStore = useAppStore();
const { bool: drawerVisible, setTrue: openDrawer } = useBoolean();

const {
  columns,
  filteredColumns,
  data,
  loading,
  pagination,
  getData,
  searchParams,
  updateSearchParams,
  resetSearchParams
} = useTable<Api.SystemManage.Role, typeof fetchGetRoleList, 'index' | 'operate'>({
  apiFn: fetchGetRoleList,
  apiParams: {
    current: 1,
    size: 10,
    // if you want to use the searchParams in Form, you need to define the following properties, and the value is null
    // the value can not be undefined, otherwise the property in Form will not be reactive
    status: null,
    roleName: null,
    roleCode: null
  },
  transformer: res => {
    const { records = [], current = 1, size = 10, total = 0 } = res.data || {};

    return {
      data: records,
      pageNum: current,
      pageSize: size,
      total
    };
  },
  onPaginationChanged(pg) {
    const { page, pageSize } = pg;

    updateSearchParams({
      current: page,
      size: pageSize
    });

    getData();
  },
  columns: () => [
    {
      type: 'selection',
      align: 'center',
      width: 48
    },
    {
      key: 'index',
      title: $t('common.index'),
      render: (_, index): string => getIndex(index),
      width: 64,
      align: 'center'
    },
    {
      key: 'roleName',
      title: $t('page.manage.role.roleName'),
      align: 'center',
      minWidth: 120
    },
    {
      key: 'roleCode',
      title: $t('page.manage.role.roleCode'),
      align: 'center',
      minWidth: 120
    },
    {
      key: 'roleDesc',
      title: $t('page.manage.role.roleDesc'),
      minWidth: 120
    },
    {
      key: 'status',
      title: $t('page.manage.role.roleStatus'),
      align: 'center',
      width: 100,
      render: row => {
        if (row.status === null) {
          return null;
        }

        const tagMap: Record<Api.Common.EnableStatus, NaiveUI.ThemeColor> = {
          1: 'success',
          2: 'warning'
        };

        const label = $t(enableStatusRecord[row.status]);

        return <NTag type={tagMap[row.status]}>{label}</NTag>;
      }
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 130,
      render: row => (
        <div class="flex-center gap-8px">
          <NButton type="primary" ghost size="small" onClick={() => handleEdit(row.id)}>
            {$t('common.edit')}
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDelete(row.id)}>
            {{
              default: () => $t('common.confirmDelete'),
              trigger: () => (
                <NButton type="error" ghost size="small">
                  {$t('common.delete')}
                </NButton>
              )
            }}
          </NPopconfirm>
        </div>
      )
    }
  ]
});

// this is for mobile, if the system does not support mobile, you can use `pagination` directly
const mobilePagination = computed(() => {
  const p: PaginationProps = {
    ...pagination,
    pageSlot: appStore.isMobile ? 3 : 9
  };

  return p;
});

const operateType = ref<OperateType>('add');

function handleAdd() {
  operateType.value = 'add';
  openDrawer();
}

const checkedRowKeys = ref<string[]>([]);

async function handleBatchDelete() {
  // request
  console.log(checkedRowKeys.value);
  window.$message?.success($t('common.deleteSuccess'));

  checkedRowKeys.value = [];

  getData();
}

/** the editing row data */
const editingData = ref<Api.SystemManage.Role | null>(null);

function handleEdit(id: number) {
  operateType.value = 'edit';
  editingData.value = data.value.find(item => item.id === id) || null;
  openDrawer();
}

async function handleDelete(id: number) {
  // request
  console.log(id);
  window.$message?.success($t('common.deleteSuccess'));

  getData();
}

function getIndex(index: number) {
  const { page = 0, pageSize = 10 } = pagination;

  return String((page - 1) * pageSize + index + 1);
}

function getRowKey(row: Api.SystemManage.User) {
  return row.id;
}
</script>

<template>
  <div class="min-h-500px flex-vertical-stretch gap-16px overflow-hidden <sm:overflow-auto">
    <RoleSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getData" />
    <NCard :title="$t('page.manage.role.title')" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="filteredColumns"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          @add="handleAdd"
          @delete="handleBatchDelete"
          @refresh="getData"
        />
      </template>
      <NDataTable
        v-model:checked-row-keys="checkedRowKeys"
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :scroll-x="702"
        :loading="loading"
        remote
        :row-key="getRowKey"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
      <RoleOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getData"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
