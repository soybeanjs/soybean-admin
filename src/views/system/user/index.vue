<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useLoading } from '@sa/hooks';
import { fetchGetDeptTree } from '@/service/api/system/dept';
import { fetchGetUserList } from '@/service/api/system/user';
import { useAppStore } from '@/store/modules/app';
import { defaultTransform, useNaivePaginatedTable, useTableOperate } from '@/hooks/common/table';
import { useAuth } from '@/hooks/business/auth';
import { $t } from '@/locales';
import UserSearch from './modules/user-search.vue';

defineOptions({
  name: 'UserList'
});

const { hasAuth } = useAuth();
const appStore = useAppStore();

const { loading: treeLoading, startLoading: startTreeLoading, endLoading: endTreeLoading } = useLoading();

const deptPattern = ref<string>();
const selectedKeys = ref<CommonType.IdType[]>([]);
const expandedKeys = ref<CommonType.IdType[]>([]);
const deptData = ref<Api.Common.CommonTreeRecord>([]);

const searchParams = ref<Api.System.UserSearchParams>({
  current: 1,
  size: 10,
  userName: null,
  nickName: null,
  userPhone: null,
  status: null,
  params: { beginTime: null, endTime: null }
});

const { loading, data, getData, getDataByPage, columnChecks, columns, mobilePagination } = useNaivePaginatedTable({
  api: fetchGetUserList,
  transform: response => defaultTransform(response),
  onPaginationParamsChange(params) {
    console.log(params);
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
      width: 64,
      align: 'center',
      render: (_, index) => index + 1
    }
  ]
});

// 操作的辅助方法
const { checkedRowKeys } = useTableOperate(data, 'id', getData);

async function getTreeData() {
  startTreeLoading();
  const { data: tree, error } = await fetchGetDeptTree();
  if (!error) {
    deptData.value = tree;
  }
  endTreeLoading();
}

function handleResetTreeData() {
  deptPattern.value = undefined;
  getTreeData();
}

function handleResetSearchParams() {
  searchParams.value = {
    current: 1,
    size: 10,
    userName: null,
    nickName: null,
    userPhone: null,
    status: null,
    params: { beginTime: null, endTime: null }
  };
  getDataByPage();
}

const selectable = computed(() => {
  return !loading.value;
});
function handleClickTree(keys: CommonType.IdType[]) {
  console.log(keys);
}
</script>

<template>
  <TableSiderLayout :sider-title="$t('page.system.dept.title')">
    <template #header-extra>
      <NButton size="small" text class="h-18px" @click.stop="() => handleResetTreeData()">
        <template #icon>
          <SvgIcon icon="ic:round-refresh" />
        </template>
      </NButton>
    </template>
    <template #sider>
      <NInput v-model:value="deptPattern" clearable :placeholder="$t('common.keywordSearch')" />
      <NSpin class="dept-tree" :show="treeLoading">
        <NTree
          v-model:expanded-keys="expandedKeys"
          v-model:selected-keys="selectedKeys"
          block-node
          show-line
          :data="deptData as []"
          :show-irrelevant-nodes="false"
          :pattern="deptPattern"
          virtual-scroll
          key-field="id"
          label-field="label"
          class="h-full min-h-200px py-3"
          :selectable="selectable"
          @update:selected-keys="handleClickTree"
        >
          <template #empty>
            <NEmpty :description="$t('page.system.dept.empty')" class="h-full min-h-200px justify-center" />
          </template>
        </NTree>
      </NSpin>
    </template>
    <div class="h-full flex-col-stretch gap-12px overflow-hidden lt-sm:overflow-auto">
      <UserSearch v-model:model="searchParams" @search="getDataByPage" @reset="handleResetSearchParams" />
      <TableRowCheckAlert v-model:checked-row-keys="checkedRowKeys" />
      <NCard :title="$t('page.system.user.title')" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
        <template #header-extra>
          <TableHeaderOperation
            v-model:columns="columnChecks"
            :disabled-delete="checkedRowKeys.length === 0"
            :loading="loading"
            :show-add="hasAuth('system:user:add')"
            :show-delete="hasAuth('system:user:remove')"
            :show-export="hasAuth('system:user:export')"
          ></TableHeaderOperation>
        </template>
        <NDataTable
          v-model:checked-row-keys="checkedRowKeys"
          :columns="columns"
          :data="data"
          size="small"
          :flex-height="!appStore.isMobile"
          :loading="loading"
          :scroll-x="962"
          remote
          :row-key="row => row.userId"
          :pagination="mobilePagination"
          class="h-full"
        >
          <template #empty>
            <NEmpty :description="$t('page.system.user.empty')" class="h-full min-h-200px justify-center" />
          </template>
        </NDataTable>
      </NCard>
    </div>
  </TableSiderLayout>
</template>

<style scoped lang="scss">
.dept-tree {
  .n-button {
    --n-padding: 8px !important;
  }

  :deep(.n-tree__empty) {
    height: 100%;
    justify-content: center;
  }

  :deep(.n-spin-content) {
    height: 100%;
  }

  :deep(.infinite-scroll) {
    height: calc(100vh - 228px - var(--calc-footer-height, 0px)) !important;
    max-height: calc(100vh - 228px - var(--calc-footer-height, 0px)) !important;
  }

  @media screen and (max-width: 1024px) {
    :deep(.infinite-scroll) {
      height: calc(100vh - 227px - var(--calc-footer-height, 0px)) !important;
      max-height: calc(100vh - 227px - var(--calc-footer-height, 0px)) !important;
    }
  }

  :deep(.n-tree-node) {
    height: 30px;
  }

  :deep(.n-tree-node-switcher) {
    height: 30px;
  }

  :deep(.n-tree-node-switcher__icon) {
    font-size: 16px !important;
    height: 16px !important;
    width: 16px !important;
  }
}

:deep(.n-data-table-wrapper),
:deep(.n-data-table-base-table),
:deep(.n-data-table-base-table-body) {
  height: 100%;
}

@media screen and (max-width: 800px) {
  :deep(.n-data-table-base-table-body) {
    max-height: calc(100vh - 400px - var(--calc-footer-height, 0px));
  }
}

@media screen and (max-width: 802px) {
  :deep(.n-data-table-base-table-body) {
    max-height: calc(100vh - 473px - var(--calc-footer-height, 0px));
  }
}

:deep(.n-card-header__main) {
  min-width: 69px !important;
}
</style>
