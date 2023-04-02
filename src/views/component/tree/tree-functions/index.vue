<!--
 * 树的相关函数
 * @author: SonnyLeo
 * @since: 2023-03-30
 * index.vue
-->
<template>
  <n-card class="h-full shadow-sm rounded-16px">
    <n-space :vertical="true">
      <n-card title="函数示例">
        <n-card>
          <template #header-extra>
            <n-space justify="space-around">
              <n-button dashed type="primary" @click="handleGenerateTreeData">重置数据</n-button>
              <n-button dashed type="warning" @click="handleNotSelectAll">清空选择</n-button>
            </n-space>
          </template>
          <n-grid :y-gap="20" cols="1 s:3 m:4 l:5 xl:6 2xl:7" responsive="screen">
            <n-grid-item><n-button @click="handleExpandAll">展开全部</n-button></n-grid-item>
            <n-grid-item><n-button @click="handleCollapseAll">折叠全部</n-button></n-grid-item>
            <n-grid-item><n-button @click="handleSelectAll">全选</n-button></n-grid-item>
            <n-grid-item><n-button @click="handleNotSelectAll">全不选</n-button></n-grid-item>
            <n-grid-item><n-button @click="handleSelectedSecondLevel">显示到第二级</n-button></n-grid-item>
            <n-grid-item><n-button @click="handleSelectedThirdLevel">显示到第三级</n-button></n-grid-item>
            <n-grid-item><n-button @click="handleSelectData">设置勾选节点</n-button></n-grid-item>
            <n-grid-item><n-button @click="handleGetCheckedData">获取选中数据</n-button></n-grid-item>
            <n-grid-item><n-button @click="handleGetIndeterminateData">获取半选数据</n-button></n-grid-item>
            <n-grid-item><n-button @click="handleAddRootDOM">添加根节点</n-button></n-grid-item>
            <n-grid-item><n-button @click="handleAddChildrenDOM">增加子节点</n-button></n-grid-item>
            <n-grid-item><n-button @click="handleDeleteTreeNode">删除子节点</n-button></n-grid-item>
            <n-grid-item><n-button @click="handleUpdateTreeNode">更新节点</n-button></n-grid-item>
            <n-grid-item><n-button @click="handleScrollTo">滚动至某节点</n-button></n-grid-item>
          </n-grid>
        </n-card>
      </n-card>
      <n-card title="结构预览" segmented>
        <template #header-extra>
          <n-space>
            <n-switch v-model:value="cascade" size="large">
              <template #checked-icon>
                <n-icon>
                  <icon-ic:round-arrow-circle-right color="#1890ff" />
                </n-icon>
              </template>
              <template #unchecked-icon>
                <n-icon>
                  <icon-ic:round-arrow-circle-left />
                </n-icon>
              </template>
            </n-switch>

            <n-button text>Cascade</n-button>
          </n-space>
        </template>
        <n-tree
          ref="treeRef"
          block-line
          :data="treeDataRef"
          checkable
          :selectable="true"
          :cascade="cascade"
          :checked-keys="checkedKeysRef"
          :expanded-keys="expandedKeysRef"
          :check-on-click="false"
          virtual-scroll
          style="height: 320px"
          @update-checked-keys="handleUpdateCheckedKeys"
          @update-expanded-keys="handleUpdateExpandedKeys"
        />
        <template #footer> 当前选中的数据是 {{ checkedKeysRef }} </template>
      </n-card>
    </n-space>
  </n-card>
</template>

<script setup lang="ts">
import { ref, toRaw } from 'vue';
import type { TreeInst } from 'naive-ui';
import { repeat } from 'seemly';

type TreeNode = {
  label: string;
  level: number;
  key: string;
  children?: TreeNode[];
};

const cascade = ref<boolean>(true);
const checkedKeysRef = ref<string[]>([]);
const expandedKeysRef = ref<string[]>([]);

const treeRef = ref<TreeInst | null>();
const treeDataRef = ref(createData());

function handleExpandAll() {
  expandedKeysRef.value = getKeysByRange(toRaw(treeDataRef.value), 1, 4);
}
function handleCollapseAll() {
  expandedKeysRef.value = [];
}

function handleSelectAll() {
  checkedKeysRef.value = getKeysByRange(toRaw(treeDataRef.value));
}

function handleNotSelectAll() {
  checkedKeysRef.value = [];
}

function handleSelectedSecondLevel() {
  expandedKeysRef.value = getKeysByRange(toRaw(treeDataRef.value), 4);
}

function handleSelectedThirdLevel() {
  expandedKeysRef.value = getKeysByRange(toRaw(treeDataRef.value), 3, 4);
}

function handleSelectData() {
  checkedKeysRef.value = ['40302010', '40302011'];
}

function handleGetCheckedData() {
  window.$message?.info('请打开浏览器控制台查看.');
  const checkedData = treeRef.value?.getCheckedData();
  console.log(checkedData!.keys, checkedData!.options);
}

function handleGetIndeterminateData() {
  window.$message?.info('请打开浏览器控制台查看.');
  const checkedData = treeRef.value?.getIndeterminateData();
  console.log(checkedData!.keys, checkedData!.options);
}

function handleAddRootDOM() {
  treeDataRef.value?.push({
    label: `根节点`,
    key: `${Date.now()}`,
    level: 4
  });
}

function handleAddChildrenDOM() {
  if (treeDataRef.value !== undefined) {
    treeDataRef.value[0].children?.push({
      label: `子节点`,
      key: `${Date.now()}`,
      level: 3
    });
  }
}

function handleDeleteTreeNode() {
  if (treeDataRef.value !== undefined) {
    const treeDOM = treeDataRef.value[0];
    treeDOM.children = treeDOM.children?.filter(item => item.key !== '4031');
  }
}

function handleUpdateTreeNode() {
  if (treeDataRef.value !== undefined) {
    treeDataRef.value[0]?.children?.forEach((item, index) => (item.label = `${item.label}-${index} 已更新`));
  }
}

function handleScrollTo() {
  treeRef.value?.scrollTo({ key: '40302213' });
}

function handleUpdateCheckedKeys(checkedKeys: Array<string>) {
  checkedKeysRef.value = checkedKeys;
}

function handleGenerateTreeData() {
  treeDataRef.value = createData();
}

function handleUpdateExpandedKeys(expandedKeys: Array<string>) {
  expandedKeysRef.value = expandedKeys;
}

function createData(level = 4, baseKey = ''): TreeNode[] | undefined {
  if (!level) return undefined;
  return repeat(5 - level, undefined).map((_, index) => {
    const key = String(baseKey) + level + index;
    return {
      label: `${createLabel(level)} - ${index}`,
      level,
      key,
      children: createData(level - 1, key)
    };
  });
}

function createLabel(level: number): string {
  if (level === 4) return '第一层';
  if (level === 3) return '第二层';
  if (level === 2) return '第三层';
  if (level === 1) return '第四层';
  return '';
}

/**
 * 根据传入的层级 level 对 data 进行筛选并返回节点的key数组
 * 包含三种情况：
 *  1. 传入 data 时， 返回所有节点的 key 数组
 *  2. 传入 data 和 任意 level (startLevel 或 endLevel) 时, 返回一级目录到该级目录的所有节点的 key 数组
 *  3. 传入 data 和 startLevel 和 endLevel 时， 返回指定 level 范围节点对应的 key 数组
 *
 *  注意: startLevel 必须小于 endLevel
 * @param data
 * @param startLevel
 * @param endLevel
 */
function getKeysByRange(data: TreeNode[] | undefined, startLevel?: number, endLevel?: number): string[] {
  const result: string[] = [];

  function traverseTree(treeData: TreeNode[]) {
    treeData.forEach(node => {
      if (startLevel === undefined && endLevel === undefined) {
        result.push(node.key);
      } else if (startLevel !== undefined && endLevel === undefined && node.level === startLevel) {
        result.push(node.key);
      } else if (
        startLevel !== undefined &&
        endLevel !== undefined &&
        node.level >= startLevel &&
        node.level <= endLevel
      ) {
        result.push(node.key);
      }
      if (node.children) {
        traverseTree(node.children);
      }
    });
  }

  if (data) {
    traverseTree(data);
  }

  return result;
}
</script>

<style scoped></style>
