<template>
  <n-card title="用户管理" :bordered="false" class="rounded-16px shadow-sm">
    <n-space class="pb-12px" justify="space-between">
      <n-space>
        <n-button type="primary" @click="handleAddTable">
          <icon-ic-round-plus class="mr-4px text-20px" />
          新增
        </n-button>
        <n-button type="error">
          <icon-ic-round-delete class="mr-4px text-20px" />
          删除
        </n-button>
        <n-button type="success">
          <icon-uil:export class="mr-4px text-20px" />
          导出Excel
        </n-button>
      </n-space>
      <n-space>
        <n-switch />
        <icon-mdi-refresh class="text-20px" />
      </n-space>
    </n-space>
    <n-data-table :columns="columns" :data="tableData" :loading="loading" :pagination="pagination" />
    <table-action-modal v-model:visible="visible" :type="modalType" :edit-data="editData" />
  </n-card>
</template>

<script setup lang="tsx">
import { reactive, ref } from 'vue';
import { NButton, NPopconfirm, NSpace, NSwitch, NTag } from 'naive-ui';
import type { DataTableColumns, PaginationProps } from 'naive-ui';
import { fetchUserManagementList } from '@/service';
import { useBoolean, useLoading } from '@/hooks';
import { TableActionModal } from './components';

const { loading, startLoading, endLoading } = useLoading(false);
const { bool: visible, setTrue: openModal } = useBoolean();

const tableData = ref<UserManagement.UserTable[]>([]);
function setTableData(data: UserManagement.UserTable[]) {
  tableData.value = data;
}

async function getTableData() {
  startLoading();
  const { data } = await fetchUserManagementList();
  if (data) {
    setTimeout(() => {
      setTableData(data);
      endLoading();
    }, 1000);
  }
}

const columns: DataTableColumns = [
  {
    type: 'selection',
    align: 'center'
  },
  {
    key: 'index',
    title: '序号',
    align: 'center'
  },
  {
    key: 'userName',
    title: '用户名',
    align: 'center'
  },
  {
    key: 'userAge',
    title: '用户年龄',
    align: 'center'
  },
  {
    key: 'userGenderLabel',
    title: '性别',
    align: 'center',
    render: row => {
      const rowData = row as unknown as UserManagement.UserTable;

      if (rowData.userGender !== 'null') {
        const tagType = {
          male: 'success',
          female: 'warning'
        } as const;
        return <NTag type={tagType[rowData.userGender]}>{rowData.userGenderLabel}</NTag>;
      }

      return <span></span>;
    }
  },
  {
    key: 'userPhone',
    title: '手机号码',
    align: 'center'
  },
  {
    key: 'userEmail',
    title: '邮箱',
    align: 'center'
  },
  {
    key: 'userRole',
    title: '角色',
    align: 'center',
    render: row => {
      const rowData = row as unknown as UserManagement.UserTable;

      const tagType = {
        super: 'primary',
        admin: 'warning',
        user: 'success'
      } as const;

      return <NTag type={tagType[rowData.userRole]}>{rowData.userRole}</NTag>;
    }
  },
  {
    key: 'disabled',
    title: '状态',
    align: 'center',
    render: row => {
      const rowData = row as unknown as UserManagement.UserTable;

      return (
        <NSwitch value={rowData.disabled} onUpdateValue={disabled => handleUpdateDisabled(disabled, rowData.id)}>
          {{ checked: () => '启用', unchecked: () => '禁用' }}
        </NSwitch>
      );
    }
  },
  {
    key: 'actions',
    title: '操作',
    align: 'center',
    render: row => {
      const rowData = row as unknown as UserManagement.UserTable;
      return (
        <NSpace justify={'center'}>
          <NButton size={'small'} onClick={() => handleEditTable(rowData.id)}>
            编辑
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDeleteTable(rowData.id)}>
            {{
              default: () => '确认删除',
              trigger: () => <NButton size={'small'}>删除</NButton>
            }}
          </NPopconfirm>
        </NSpace>
      );
    }
  }
];

function handleUpdateDisabled(disabled: boolean, rowId: string) {
  const index = tableData.value.findIndex(item => item.id === rowId);
  if (index > -1) {
    tableData.value[index].disabled = disabled;
  }
}

type ModalType = 'add' | 'edit';

const modalType = ref<ModalType>('add');
function setModalType(type: ModalType) {
  modalType.value = type;
}

const editData = ref<UserManagement.UserTable | null>(null);
function setEditData(data: UserManagement.UserTable | null) {
  editData.value = data;
}

function handleAddTable() {
  openModal();
  setModalType('add');
}

function handleEditTable(rowId: string) {
  const findItem = tableData.value.find(item => item.id === rowId);
  if (findItem) {
    setEditData(findItem);
  }
  setModalType('edit');
  openModal();
}
function handleDeleteTable(rowId: string) {
  window.$message?.info(`点击了删除，rowId为${rowId}`);
}

const pagination = reactive<PaginationProps>({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 15, 20, 25, 30],
  onChange: (page: number) => {
    pagination.page = page;
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize;
    pagination.page = 1;
  }
});

function init() {
  getTableData();
}

// 初始化
init();
</script>

<style scoped></style>
