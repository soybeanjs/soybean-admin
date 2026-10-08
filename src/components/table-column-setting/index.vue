<script setup lang="ts">
import { computed } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';
import { useI18n } from 'vue-i18n';
import { SButtonIcon, SCheckbox, SPopover, SSeparator } from '@vean/ui';
import type { TableColumnCheck } from '@vean/ui';

defineOptions({ name: 'TableColumnSetting' });

/**
 * 列检查表由 `usePaginatedTable` 的 `columnChecks` 提供，双向绑定。
 * 「列顺序」只对可见列有意义，所以拖动的是 `visibleColumns` 派生视图，
 * 回写时再按对象同一性把重排结果合并回原始数组，避免丢失 `hidden` 列。
 */
const columns = defineModel<TableColumnCheck[]>('columns', { required: true });

const { t } = useI18n();

const visibleColumns = computed({
  get: () => columns.value.filter(column => !column.hidden),
  set: next => {
    const visible = new Set(next);
    const queue = [...next];
    columns.value = columns.value.map(column => (visible.has(column) ? (queue.shift() ?? column) : column));
  }
});

const checkedAll = computed(() => visibleColumns.value.every(column => column.checked !== false));
const indeterminate = computed(
  () => !checkedAll.value && visibleColumns.value.some(column => column.checked !== false)
);
const selectAllState = computed(() => (indeterminate.value ? 'indeterminate' : checkedAll.value));

/** `TableColumnCheckTitle` 允许 VNode/Component，本仓库始终由 `header` 字符串派生，回落 key。 */
function resolveTitle(column: TableColumnCheck): string {
  return typeof column.title === 'string' ? column.title : column.key;
}

function onSelectAll(value: boolean | 'indeterminate' | null) {
  if (typeof value !== 'boolean') {
    return;
  }
  const target = value;
  columns.value = columns.value.map(column => (column.hidden ? column : { ...column, checked: target }));
}

function reset() {
  columns.value = columns.value.map(column => ({ ...column, checked: true }));
}
</script>

<template>
  <SPopover placement="bottom-end">
    <template #trigger>
      <SButtonIcon icon="lucide:settings-2" variant="ghost" :aria-label="t('common.columnSetting')" />
    </template>

    <div class="w-48 flex flex-col gap-1">
      <SCheckbox
        :model-value="selectAllState"
        :label="t('common.selectAll')"
        class="px-1 py-1"
        @update:model-value="onSelectAll"
      />

      <SSeparator />

      <VueDraggable v-model="visibleColumns" :animation="150" class="flex flex-col gap-1">
        <div
          v-for="column in visibleColumns"
          :key="column.key"
          class="h-8 flex items-center gap-2 rounded-md px-1 hover:bg-primary/10"
        >
          <span class="i-lucide:grip-vertical shrink-0 cursor-grab opacity-60" />
          <SCheckbox v-model="column.checked" class="min-w-0 flex-1" :label="resolveTitle(column)" />
        </div>
      </VueDraggable>

      <SSeparator />

      <SButtonIcon
        icon="lucide:rotate-ccw"
        variant="ghost"
        size="sm"
        class="self-start"
        :aria-label="t('common.reset')"
        @click="reset"
      />
    </div>
  </SPopover>
</template>
