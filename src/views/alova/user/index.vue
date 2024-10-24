<script setup lang="tsx">
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import { usePagination } from '@sa/alova/client';
import { reactive } from 'vue';
import { batchDeleteUser, deleteUser, fetchGetUserList } from '@/service-alova/api';
import { $t } from '@/locales';
import { useAppStore } from '@/store/modules/app';
import { enableStatusRecord, userGenderRecord } from '@/constants/business';
import useCheckedColumns from './hooks/use-checked-columns';
import useTableOperate from './hooks/use-table-operate';
import UserOperateDrawer from './modules/user-operate-drawer.vue';
import UserSearch from './modules/user-search.vue';

const appStore = useAppStore();

const searchParams = reactive({
  // if you want to use the searchParams in Form, you need to define the following properties, and the value is null
  // the value can not be undefined, otherwise the property in Form will not be reactive
  status: null,
  userName: null,
  userGender: null,
  nickName: null,
  userPhone: null,
  userEmail: null
});
const { loading, data, refresh, reload, page, pageSize, pageCount, send, remove } = usePagination(
  (pageNum, size) =>
    fetchGetUserList({
      ...searchParams,
      current: pageNum,
      size
    }),
  {
    data: ({ records }) => records,
    total: ({ total }) => total,

    // trigger reload when states in `searchParams` changed
    watchingStates: [searchParams],

    // debounce of `searchParams`
    debounce: [1000]
  }
);
const getDataByPage = (newPage = 1) => {
  page.value = newPage;
  send(page.value, pageSize.value);
};

const {
  drawerVisible,
  operateType,
  editingData,
  handleAdd,
  handleEdit,
  handleDelete,
  handleBatchDelete,
  checkedRowKeys,
  deleting
  // batchDeleting
  // closeDrawer
} = useTableOperate(data, {
  async delete(row) {
    await deleteUser(row.id);
    remove(row);
  },
  async batchDelete(rows) {
    await batchDeleteUser(rows.map(({ id }) => id));
    remove(...rows);
  }
});

function edit(id: number) {
  handleEdit(id);
}

const { columnChecks, columns } = useCheckedColumns<typeof fetchGetUserList>(() => [
  {
    type: 'selection',
    align: 'center',
    width: 48
  },
  {
    key: 'userName',
    title: $t('page.manage.user.userName'),
    align: 'center',
    minWidth: 100
  },
  {
    key: 'userGender',
    title: $t('page.manage.user.userGender'),
    align: 'center',
    width: 100,
    render: row => {
      if (row.userGender === null) {
        return null;
      }

      const tagMap: Record<Api.SystemManage.UserGender, NaiveUI.ThemeColor> = {
        1: 'primary',
        2: 'error'
      };

      const label = $t(userGenderRecord[row.userGender]);

      return <NTag type={tagMap[row.userGender]}>{label}</NTag>;
    }
  },
  {
    key: 'nickName',
    title: $t('page.manage.user.nickName'),
    align: 'center',
    minWidth: 100
  },
  {
    key: 'userPhone',
    title: $t('page.manage.user.userPhone'),
    align: 'center',
    width: 120
  },
  {
    key: 'userEmail',
    title: $t('page.manage.user.userEmail'),
    align: 'center',
    minWidth: 200
  },
  {
    key: 'status',
    title: $t('page.manage.user.userStatus'),
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
        <NButton type="primary" ghost size="small" onClick={() => edit(row.id)}>
          {$t('common.edit')}
        </NButton>
        <NPopconfirm
          onPositiveClick={() => handleDelete(row.id)}
          positiveButtonProps={{
            loading: deleting.value
          }}
        >
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
]);
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <UserSearch v-model:model="searchParams" @search="getDataByPage" />
    <NCard :title="$t('page.manage.user.title')" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          @add="handleAdd"
          @delete="handleBatchDelete"
          @refresh="refresh"
        />
      </template>
      <NDataTable
        v-model:checked-row-keys="checkedRowKeys"
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :scroll-x="962"
        :loading="loading"
        remote
        :row-key="row => row.id"
        :pagination="{
          page,
          pageSize,
          showSizePicker: true,
          pageCount,
          pageSizes: [10, 15, 20, 25, 30],
          onUpdatePage(value) {
            page = value;
          },
          onUpdatePageSize(value) {
            pageSize = value;
          }
        }"
        class="sm:h-full"
      />
      <UserOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="reload"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
