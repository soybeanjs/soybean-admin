<script lang="ts" setup>
import { ref } from 'vue';
import { useLoading } from '@sa/hooks';
import { fetchGetDeptTree } from '@/service/api/system/dept';

defineOptions({
  name: 'UserList'
});

const { loading: treeLoading, startLoading: startTreeLoading, endLoading: endTreeLoading } = useLoading();

const deptPattern = ref<string>();
const deptData = ref<Api.Common.CommonTreeRecord>([]);

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
</script>

<template>
  <TableSiderLayout :sider-title="$t('page.system.dept.deptList')">
    <template #header-extra>
      <NButton size="small" text class="h-18px" @click.stop="() => handleResetTreeData()">
        <template #icon>
          <SvgIcon icon="ic:round-refresh" />
        </template>
      </NButton>
    </template>
    <template #sider>
      <NInput v-model:value="deptPattern" clearable :placeholder="$t('common.keywordSearch')" />
      <NSpin :show="treeLoading" class="dept-tree">
        <NTree class="h-full min-h-200px py-3"></NTree>
      </NSpin>
    </template>
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
    height: 25px;
  }

  :deep(.n-tree-node-switcher) {
    height: 25px;
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
