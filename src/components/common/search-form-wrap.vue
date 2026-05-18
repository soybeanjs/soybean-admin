<script setup lang="ts">
import { computed, ref, useSlots, watch } from 'vue';
import { $t } from '@/locales';

defineOptions({ name: 'SearchFormWrap' });

interface Props {
  /** 每行列数配置，响应式格式 "s:1 m:2 l:4" 或固定数字 */
  cols?: number | string;
  /** 每个查询条件占用的栅格数 */
  span?: number;
  /** 是否默认折叠 */
  defaultCollapsed?: boolean;
  /** 搜索按钮文本 */
  searchButtonText?: string;
  /** 重置按钮文本 */
  resetButtonText?: string;
  /** 是否显示重置按钮 */
  showResetButton?: boolean;
  /** 是否禁用搜索按钮 */
  searchDisabled?: boolean;
  /** 是否禁用重置按钮 */
  resetDisabled?: boolean;
  /** 搜索按钮加载状态 */
  searchLoading?: boolean;
  /** 展开按钮文本 */
  expandButtonText?: string;
  /** 折叠按钮文本 */
  collapseButtonText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  cols: 's:1 m:2 l:4',
  span: 1,
  defaultCollapsed: true,
  searchButtonText: undefined,
  resetButtonText: undefined,
  showResetButton: true,
  searchDisabled: false,
  resetDisabled: false,
  searchLoading: false,
  expandButtonText: undefined,
  collapseButtonText: undefined
});

interface Emits {
  (e: 'search'): void;
  (e: 'reset'): void;
  (e: 'expand', collapsed: boolean): void;
}

const emit = defineEmits<Emits>();

const slots = useSlots();

const collapsed = ref(props.defaultCollapsed);

const itemSpan = computed(() => {
  const spanValue = props.span;
  if (spanValue < 1) return 1;
  if (spanValue > 24) return 24;
  return spanValue;
});

interface SlotItem {
  vnode: ReturnType<NonNullable<typeof slots.default>>[number];
  key: string | number;
}

const defaultSlotItems = computed(() => {
  const defaultSlot = slots.default;
  if (!defaultSlot) return [];

  const vnodes = defaultSlot();
  const items: SlotItem[] = [];

  vnodes.forEach((vnode, index) => {
    if (vnode.type && vnode.type !== Comment) {
      items.push({
        vnode,
        key: typeof vnode.key === 'string' || typeof vnode.key === 'number' ? vnode.key : index
      });
    }
  });

  return items;
});

const itemCount = computed(() => defaultSlotItems.value.length);

const currentCols = computed(() => {
  if (typeof props.cols === 'number') {
    return props.cols;
  }
  const lMatch = props.cols.match(/l:(\d+)/);
  return lMatch ? parseInt(lMatch[1], 10) : 4;
});

const maxVisibleInFirstRow = computed(() => {
  return Math.max(0, currentCols.value - 1);
});

const showExpandButton = computed(() => itemCount.value > maxVisibleInFirstRow.value);

const searchButtonText = computed(() => props.searchButtonText ?? $t('common.search'));
const resetButtonText = computed(() => props.resetButtonText ?? $t('common.reset'));
const expandButtonText = computed(() => props.expandButtonText ?? $t('common.switch'));
const collapseButtonText = computed(() => props.collapseButtonText ?? $t('common.close'));

function toggleCollapse() {
  collapsed.value = !collapsed.value;
  emit('expand', collapsed.value);
}

function handleSearch() {
  emit('search');
}

function handleReset() {
  emit('reset');
}

watch(
  () => props.defaultCollapsed,
  newVal => {
    collapsed.value = newVal;
  }
);
</script>

<template>
  <div class="search-form-wrap">
    <NGrid :cols="cols" :x-gap="16" :y-gap="16" responsive="screen">
      <template v-if="collapsed">
        <template v-for="(item, index) in defaultSlotItems" :key="item.key">
          <NGi v-if="index < maxVisibleInFirstRow" :span="itemSpan">
            <component :is="item.vnode" />
          </NGi>
        </template>
      </template>

      <template v-else>
        <template v-for="item in defaultSlotItems" :key="item.key">
          <NGi :span="itemSpan">
            <component :is="item.vnode" />
          </NGi>
        </template>
      </template>

      <NGi :span="itemSpan">
        <NSpace align="center" justify="end" class="h-full">
          <NButton type="primary" :disabled="searchDisabled" :loading="searchLoading" @click="handleSearch">
            <template #icon>
              <icon-ic-round-search />
            </template>
            {{ searchButtonText }}
          </NButton>
          <NButton v-if="showResetButton" :disabled="resetDisabled" @click="handleReset">
            <template #icon>
              <icon-ic-round-refresh />
            </template>
            {{ resetButtonText }}
          </NButton>
          <NButton v-if="showExpandButton" text type="primary" @click="toggleCollapse">
            <template #icon>
              <icon-mdi-chevron-up v-if="!collapsed" />
              <icon-mdi-chevron-down v-else />
            </template>
            {{ collapsed ? expandButtonText : collapseButtonText }}
          </NButton>
        </NSpace>
      </NGi>
    </NGrid>
  </div>
</template>

<style scoped>
.search-form-wrap {
  width: 100%;
}
</style>
