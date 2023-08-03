<template>
  <div class="h-full overflow-hidden">
    <n-card title="表格" :bordered="false" class="h-full rounded-8px shadow-sm">
      <n-space :vertical="true">
        <n-space>
          <n-button @click="getDataSource">有数据</n-button>
          <n-button @click="getEmptyDataSource">空数据</n-button>
        </n-space>
        <loading-empty-wrapper class="h-480px" :loading="loading" :empty="empty">
          <n-data-table :columns="columns" :data="dataSource" :flex-height="true" class="h-480px" />
        </loading-empty-wrapper>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="tsx">
import { onMounted, ref } from 'vue';
import { NSpace, NButton, NPopconfirm } from 'naive-ui';
import type { DataTableColumn } from 'naive-ui';
import { useLoadingEmpty } from '@/hooks';
import { getRandomInteger } from '@/utils';

interface DataSource {
  name: string;
  age: number;
  address: string;
}

const { loading, startLoading, endLoading, empty, setEmpty } = useLoadingEmpty();

const columns: DataTableColumn<DataSource>[] = [
  {
    title: 'Name',
    key: 'name',
    align: 'center'
  },
  {
    title: 'Age',
    key: 'age',
    align: 'center'
  },
  {
    title: 'Address',
    key: 'address',
    align: 'center'
  },
  {
    key: 'action',
    title: 'Action',
    align: 'center',
    render: row => {
      return (
        <NSpace justify={'center'}>
          <NButton
            size={'small'}
            onClick={() => {
              handleEdit(row.name);
            }}
          >
            编辑
          </NButton>
          <NPopconfirm
            onPositiveClick={() => {
              handleDelete(row.name);
            }}
          >
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

const dataSource = ref<DataSource[]>([]);

function createDataSource(): DataSource[] {
  return Array(100)
    .fill(1)
    .map((_item, index) => {
      return {
        name: `Name${index}`,
        age: getRandomInteger(30, 20),
        address: '中国'
      };
    });
}

function getDataSource() {
  startLoading();
  setTimeout(() => {
    dataSource.value = createDataSource();
    endLoading();
    setEmpty(!dataSource.value.length);
  }, 1000);
}

function getEmptyDataSource() {
  startLoading();
  setTimeout(() => {
    dataSource.value = [];
    endLoading();
    setEmpty(!dataSource.value.length);
  }, 1000);
}

function handleEdit(_name: string) {
  //
}

function handleDelete(_name: string) {
  //
}

onMounted(() => {
  getDataSource();
});
</script>

<style scoped></style>
