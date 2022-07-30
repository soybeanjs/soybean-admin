<template>
  <div>
    <n-data-table :columns="columns" :data="tableData" :loading="loading" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { DataTableColumns } from 'naive-ui';
import { fetchUserManagementList } from '@/service';
import { useLoading } from '@/hooks';

const { loading, startLoading, endLoading } = useLoading(false);

const columns: DataTableColumns = [
  {
    key: 'userName',
    title: '用户名'
  },
  {
    key: 'userAge',
    title: '用户年龄'
  },
  {
    key: 'userGenderLabel',
    title: '性别'
  }
];

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

function init() {
  getTableData();
}

// 初始化
init();
</script>

<style scoped></style>
