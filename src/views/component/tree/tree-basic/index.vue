<!--
 * 基础树组件
 * @author: SonnyLeo
 * @since: 2023-03-30
 * index.vue
-->
<template>
  <div>
    <n-card title="基础组件" class="h-full shadow-sm rounded-16px">
      <n-grid :x-gap="20" :y-gap="20" cols="0 600:2 1000:3">
        <n-grid-item>
          <n-card title="基础实例 | 默认展开第一层" :segmented="segmented" class="shadow-sm rounded-16px">
            <n-tree
              ref="caseOneTreeRef"
              block-line
              :data="data"
              checkable
              selectable
              expand-on-click
              :cascade="cascade"
              :default-expanded-keys="caseOneDefaultExpandedKeys"
              @update-checked-keys="caseOneUpdateCheckedKeys"
            />
            <template #footer> 当前选中的节点是: {{ caseOneCheckedKeys }} </template>
          </n-card></n-grid-item
        >
        <n-grid-item>
          <n-card title="可勾选 | 默认全部展开" :segmented="segmented" class="shadow-sm rounded-16px">
            <n-tree
              block-line
              :data="data"
              checkable
              selectable
              expand-on-click
              default-expand-all
              :cascade="cascade"
              :checked-keys="caseTwoCheckedKeys"
              @update:checked-keys="caseTwoCheckedKeysChange"
            /> </n-card
        ></n-grid-item>
        <n-grid-item>
          <n-card title="指定项目 | 展开或勾选" class="shadow-sm rounded-16px">
            <template #header-extra>
              <n-space justify="space-around">
                <n-button rounded @click="caseThreeExpandAll">全部展开</n-button>
                <n-button rounded type="primary" @click="caseThreeCheckedAll">全部勾选</n-button>
              </n-space>
            </template>
            <n-tree
              block-line
              :data="data"
              checkable
              selectable
              expand-on-click
              :checked-keys="caseThreeCheckedKeys"
              :expanded-keys="caseThreeExpandedKeys"
              @update:checked-keys="caseThreeCheckedKeysChange"
              @update:expanded-keys="caseThreeExpandKeysChange"
            />
            <template #footer> 当前选中的节点是: {{ caseThreeCheckedKeys }} </template>
          </n-card>
        </n-grid-item>
        <n-grid-item>
          <n-card title="懒加载" class="shadow-sm rounded-16px" :segmented="segmented">
            <n-tree
              block-line
              checkable
              draggable
              :data="remoteData"
              :checked-keys="caseFourCheckedKeys"
              :on-load="handleLoad"
              :expanded-keys="caseFourExpandedKeys"
              check-strategy="all"
              :allow-checking-not-loaded="true"
              :cascade="cascade"
              expand-on-click
              @update:checked-keys="caseFourCheckedKeysChange"
              @update:expanded-keys="caseFourExpandKeysChange"
            />
          </n-card>
        </n-grid-item>
        <n-grid-item>
          <n-card title="异步数据 | 默认全部展开" class="shadow-sm rounded-16px" :segmented="segmented">
            <template #header-extra>
              <n-button @click="handleInitData">加载数据</n-button>
            </template>
            <n-spin :show="loading">
              <n-tree
                block-line
                :data="caseFiveData"
                checkable
                selectable
                expand-on-click
                :cascade="cascade"
                :checked-keys="caseFiveCheckedKeys"
                :default-expanded-keys="caseFiveDefaultExpandedKeys"
                @update:checked-keys="caseFiveCheckedKeysChange"
              />
              <template #description> 正在加载数据中... </template>
            </n-spin>
          </n-card>
        </n-grid-item>
        <n-grid-item>
          <n-card title="为节点绑定点击事件" class="shadow-sm rounded-16px" :segmented="segmented">
            <n-tree
              block-line
              :data="data"
              :default-expanded-keys="caseSixDefaultExpandedKeys"
              :node-props="nodeProps"
            />
          </n-card>
        </n-grid-item>
        <n-grid-item>
          <n-card title="自定义前缀 | 文件树" class="shadow-sm rounded-16px" :segmented="segmented"
            ><n-tree
              block-line
              expand-on-click
              :data="caseSevenData"
              :node-props="nodeProps"
              :default-expanded-keys="caseSevenDefaultExpandedKeys"
              :on-update:expanded-keys="updatePrefixWithExpanded"
            />
          </n-card>
        </n-grid-item>

        <n-grid-item>
          <n-card title="自定义开关 | 打开和关闭的图标" class="shadow-sm rounded-16px" :segmented="segmented">
            <n-tree
              block-line
              expand-on-click
              :data="data"
              :default-expanded-keys="caseEightDefaultExpandedKeys"
              :render-switcher-icon="renderSwitcherIconWithExpaned"
              selectable
            />
          </n-card>
        </n-grid-item>
      </n-grid>
    </n-card>
  </div>
</template>

<script setup lang="tsx">
import { ref, h } from 'vue';
import type { TreeOption, TreeInst } from 'naive-ui';
import { NIcon } from 'naive-ui';
import { repeat } from 'seemly';
import { useIconRender } from '@/composables';
import { useLoading } from '@/hooks';

const { iconRender } = useIconRender();

const cascade = ref<boolean>(true);
const segmented = ref<boolean>(true);

const caseOneTreeRef = ref<TreeInst | null>(null);
const caseOneCheckedKeys = ref<string[]>([]);
const caseOneDefaultExpandedKeys = ref<string[]>(['20']);
function caseOneUpdateCheckedKeys(checkedKeys: string[]) {
  caseOneCheckedKeys.value = checkedKeys;
}

const caseTwoCheckedKeys = ref<string[]>([]);
function caseTwoCheckedKeysChange(checkedKeys: Array<string>) {
  caseTwoCheckedKeys.value = checkedKeys;
}

const caseThreeCheckedKeys = ref<string[]>([]);
const caseThreeExpandedKeys = ref<string[]>([]);
function caseThreeCheckedKeysChange(checkedKeys: Array<string>) {
  caseThreeCheckedKeys.value = checkedKeys;
}
function caseThreeExpandKeysChange(expandKeys: Array<string>) {
  caseThreeExpandedKeys.value = expandKeys;
}
function caseThreeCheckedAll() {
  caseThreeCheckedKeys.value = getAllKeys(createData());
}
function caseThreeExpandAll() {
  caseThreeExpandedKeys.value = ['20', '21'];
}

const caseFourCheckedKeys = ref<string[]>([]);
const caseFourExpandedKeys = ref<string[]>([]);
function caseFourCheckedKeysChange(checkedKeys: Array<string>) {
  caseFourCheckedKeys.value = checkedKeys;
}
function caseFourExpandKeysChange(expandKeys: Array<string>) {
  caseFourExpandedKeys.value = expandKeys;
}

function handleLoad(node: TreeOption) {
  return new Promise<void>(resolve => {
    setTimeout(() => {
      node.children = [
        {
          label: nextLabel(node.label),
          key: node.key + nextLabel(node.label),
          isLeaf: false
        }
      ];
      resolve();
    }, 1000);
  });
}

const { startLoading, endLoading, loading } = useLoading();
const caseFiveData = ref<TreeOption[]>();
const caseFiveCheckedKeys = ref<string[]>([]);
const caseFiveDefaultExpandedKeys = ref<string[]>(['20', '21']);

function caseFiveCheckedKeysChange(checkedKeys: Array<string>) {
  caseFiveCheckedKeys.value = checkedKeys;
}

function handleInitData() {
  loadRemoteData().then(res => {
    caseFiveData.value = res as any;
  });
}

function loadRemoteData() {
  startLoading();
  return new Promise<void>(resolve => {
    const tempData: any = createData();
    setTimeout(() => {
      endLoading();
      resolve(tempData);
    }, 1000);
  });
}

const caseSixDefaultExpandedKeys = ref<string[]>(['20']);

const updatePrefixWithExpanded = (
  _keys: Array<string | number>,
  _option: Array<TreeOption | null>,
  meta: {
    node: TreeOption | null;
    action: 'expand' | 'collapse' | 'filter';
  }
) => {
  if (!meta.node) return;
  switch (meta.action) {
    case 'expand':
      meta.node.prefix = () =>
        h(NIcon, null, {
          default: () => <icon-ph-folder-open />
        });
      break;
    case 'collapse':
      meta.node.prefix = () =>
        h(NIcon, null, {
          default: () => <icon-ph-folder-fill />
        });
      break;
    default:
      break;
  }
};
const nodeProps = ({ option }: { option: TreeOption }) => {
  return {
    onClick() {
      if (!option.children && !option.disabled) {
        window.$message?.info(`[Click] ${option.label}`);
      }
    }
  };
};

const caseSevenData = [
  {
    key: '文件夹',
    label: '文件夹',
    prefix: () =>
      h(NIcon, null, {
        default: () => h(<icon-ph-folder-fill />)
      }),
    children: [
      {
        key: '空的',
        label: '空的',
        disabled: true,
        prefix: () =>
          h(NIcon, null, {
            default: () => h(<icon-ph-folder-open />)
          })
      },
      {
        key: '我的文件',
        label: '我的文件',
        prefix: () =>
          h(NIcon, null, {
            default: () => h(<icon-ph-folder-fill />)
          }),
        children: [
          {
            label: 'template.txt',
            key: 'template.txt',
            prefix: () =>
              h(NIcon, null, {
                default: () => h(<icon-bi-filetype-txt />)
              })
          }
        ]
      }
    ]
  }
];

const caseSevenDefaultExpandedKeys = ref<string[]>(['文件夹', '我的文件']);
const caseEightDefaultExpandedKeys = ref<string[]>(['20']);

const renderSwitcherIconWithExpaned = ({ expanded }: { expanded: boolean }) =>
  h(NIcon, null, {
    default: () => h(expanded ? iconRender({ icon: 'solar:moon-broken' }) : iconRender({ icon: 'solar:sun-broken' }))
  });

function createRemoteData() {
  return [
    {
      label: nextLabel(),
      key: 1,
      isLeaf: false
    },
    {
      label: nextLabel(),
      key: 2,
      isLeaf: false
    }
  ];
}

function nextLabel(currentLabel?: string): string {
  if (!currentLabel) return 'Out of Tao, One is born';
  if (currentLabel === 'Out of Tao, One is born') return 'Out of One, Two';
  if (currentLabel === 'Out of One, Two') return 'Out of Two, Three';
  if (currentLabel === 'Out of Two, Three') {
    return 'Out of Three, the created universe';
  }
  if (currentLabel === 'Out of Three, the created universe') {
    return 'Out of Tao, One is born';
  }
  return '';
}

const remoteData = ref(createRemoteData());

function createData(level = 2, baseKey = ''): TreeOption[] | undefined {
  if (!level) return undefined;
  return repeat(4 - level, undefined).map((_, index) => {
    const key = String(baseKey) + level + index;
    return {
      label: createLabel(level),
      key,
      children: createData(level - 1, key)
    };
  });
}

function createLabel(level: number): string {
  if (level === 2) return '道生一';
  if (level === 1) return '一生二';
  return '';
}

function getAllKeys(data: TreeOption[] | undefined): string[] {
  const keys: string[] = [];
  if (data !== undefined) {
    data.forEach(item => {
      keys.push(item.key as string);
      if (item.children) {
        keys.push(...getAllKeys(item.children as TreeOption[]));
      }
    });
  }
  return keys;
}

const data = ref(createData());
</script>

<style scoped></style>
