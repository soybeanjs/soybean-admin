<!--
 * 可搜索树组件
 * @author: SonnyLeo
 * @since: 2023-03-30
 * index.vue
-->
<template>
  <div>
    <n-card title="自定义树" class="h-full shadow-sm rounded-16px">
      <n-grid :x-gap="20" :y-gap="20" cols="0 600:2 1000:3">
        <n-grid-item>
          <n-card title="右侧自定义后缀图标" :segmented="segmented" class="shadow-sm rounded-16px">
            <n-tree
              block-line
              :data="caseOneData"
              expand-on-click
              :selectable="false"
              :default-expanded-keys="caseOneDefaultExpandedKeys"
            /> </n-card
        ></n-grid-item>
        <n-grid-item>
          <n-card title="右键菜单" :segmented="segmented" class="shadow-sm rounded-16px">
            <n-tree
              block-line
              :data="data"
              :default-expanded-keys="caseTwoDefaultExpandedKeys"
              :node-props="caseTwoNodeProps"
            />
            <n-dropdown
              trigger="manual"
              placement="bottom-start"
              :show="showDropdown"
              :options="options"
              :x="x"
              :y="y"
              @select="handleSelect"
              @clickoutside="handleClickOutside"
            /> </n-card
        ></n-grid-item>
        <n-grid-item>
          <n-card title="可搜索的树组件" class="shadow-sm rounded-16px">
            <n-space vertical :size="12">
              <n-input v-model:value="pattern" placeholder="搜索" />
              <n-switch v-model:value="showIrrelevantNodes">
                <template #checked> 展示搜索无关的节点 </template>
                <template #unchecked> 隐藏搜索无关的节点 </template>
              </n-switch>
              <n-tree :show-irrelevant-nodes="showIrrelevantNodes" :pattern="pattern" :data="data" block-line />
            </n-space>
          </n-card>
        </n-grid-item>
        <n-grid-item>
          <n-card title="自定义前缀和后缀" class="shadow-sm rounded-16px" :segmented="segmented">
            <n-tree
              block-line
              :data="caseFourData"
              :default-expanded-keys="caseFourDefaultExpandedKeys"
              :selectable="false"
            />
          </n-card>
        </n-grid-item>
        <n-grid-item>
          <n-card title="批量渲染前缀和后缀" class="shadow-sm rounded-16px" :segmented="segmented">
            <n-tree
              block-line
              :data="data"
              :default-expanded-keys="caseFiveDefaultExpandedKeys"
              :render-prefix="renderPrefix"
              :render-label="renderLabel"
              :render-suffix="renderSuffix"
              :selectable="false"
            />
          </n-card>
        </n-grid-item>
        <n-grid-item>
          <n-card title="滚动到指定节点" class="shadow-sm rounded-16px" :segmented="segmented">
            <template #header-extra>
              <n-button @click="handleCaseSixClick">滚动</n-button>
            </template>
            <n-tree
              ref="caseSixTreeRef"
              block-line
              :data="data"
              default-expand-all
              virtual-scroll
              style="height: 120px"
            />
          </n-card>
        </n-grid-item>
      </n-grid>
    </n-card>
  </div>
</template>

<script setup lang="tsx">
import { ref, h } from 'vue';
import type { TreeOption, DropdownOption, TreeInst } from 'naive-ui';
import { NSpace, NButton } from 'naive-ui';
import { repeat } from 'seemly';
import { useIconRender } from '@/composables';

const { iconRender } = useIconRender();
const segmented = ref<boolean>(true);

/** 实例一相关 */
const caseOneData = ref<TreeOption[] | undefined>(createSuffixData());
const caseOneDefaultExpandedKeys = ref<string[]>([]);

/** 实例二相关 */
const caseTwoDefaultExpandedKeys = ref<string[]>(['20']);
const showDropdown = ref<boolean>(false);
const x = ref<number>(0);
const y = ref<number>(0);
const options = ref<DropdownOption[] | undefined>([
  { label: '编辑', key: 'edit', icon: iconRender({ icon: 'mdi:pencil', fontSize: 18 }) },
  { label: '删除', key: 'delete', icon: iconRender({ icon: 'mdi:trash-can-outline', fontSize: 18 }) }
]);
/** 右键单击事件 */
function handleClickOutside() {
  showDropdown.value = false;
}
/** 左键单击事件 */
function handleSelect(key: string | number, option: DropdownOption) {
  console.log(key, option);
  showDropdown.value = false;
}
/** 树节点绑定事件 */
function caseTwoNodeProps() {
  return {
    onContextmenu(e: MouseEvent): void {
      showDropdown.value = true;
      x.value = e.clientX;
      y.value = e.clientY;
      e.preventDefault();
    }
  };
}

/** 实例三相关 */
const pattern = ref<string>('');
const showIrrelevantNodes = ref(false);

/** 实例四相关 */
const caseFourData = ref<TreeOption[] | undefined>(createPrefixAndSuffixData());
const caseFourDefaultExpandedKeys = ref<string[]>(['20', '21']);

/** 实例五相关 */
const caseFiveDefaultExpandedKeys = ref<string[]>(['20', '21']);

function renderPrefix({ option }: { option: TreeOption }) {
  return h(NButton, { text: true, type: 'primary' }, { default: () => `Prefix-${option.level}` });
}

function renderLabel({ option }: { option: TreeOption }) {
  return `${option.label} :)`;
}

function renderSuffix({ option }: { option: TreeOption }) {
  return h(NButton, { text: true, type: 'primary' }, { default: () => `Suffix-${option.level}` });
}

/** 实例六相关 */
const caseSixTreeRef = ref<TreeInst | null>(null);
function handleCaseSixClick() {
  caseSixTreeRef.value?.scrollTo({ key: '21' });
}

/** 模拟数据相关 */
function createPrefixAndSuffixData(level = 2, baseKey = ''): TreeOption[] | undefined {
  if (!level) return undefined;
  return repeat(4 - level, undefined).map((_, index) => {
    const key = String(baseKey) + level + index;
    return {
      label: createLabel(level),
      key,
      children: createPrefixAndSuffixData(level - 1, key),
      suffix: () => h(NButton, { text: true, type: 'primary' }, { default: () => 'Suffix' }),
      prefix: () => h(NButton, { text: true, type: 'primary' }, { default: () => 'Prefix' })
    };
  });
}

function createSuffixData(level = 2, baseKey = ''): TreeOption[] | undefined {
  if (!level) return undefined;
  return repeat(4 - level, undefined).map((_, index) => {
    const key = String(baseKey) + level + index;
    return {
      label: createLabel(level),
      key,
      children: createSuffixData(level - 1, key),
      suffix: () =>
        h(NSpace, { justify: 'space-evenly' }, () => [
          h(NButton, { text: true, class: 'pt-1.5' }, { default: () => <icon-mdi-plus class="text-18px" /> }),
          h(
            NButton,
            { text: true, class: 'pt-1.5' },
            { default: () => <icon-mdi-trash-can-outline class="text-18px" /> }
          )
        ])
    };
  });
}

function createData(level = 2, baseKey = ''): TreeOption[] | undefined {
  if (!level) return undefined;
  return repeat(4 - level, undefined).map((_, index) => {
    const key = String(baseKey) + level + index;
    return {
      label: createLabel(level),
      level,
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

const data = ref(createData());
</script>

<style scoped></style>
