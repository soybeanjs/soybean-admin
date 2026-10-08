<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { SButtonIcon, SPopconfirm } from '@vean/ui';
import type { TableColumnCheck } from '@vean/ui';
import TableColumnSetting from '@/components/table-column-setting/index.vue';

defineOptions({ name: 'TableHeaderOperation' });

withDefaults(defineProps<Props>(), {
  disabledDelete: true,
  loading: false,
  deleteCount: 0
});

const emit = defineEmits<Emits>();

defineSlots<{
  /** 搜索区与操作按钮同排时使用 */
  default?: () => unknown;
  /** 最右侧的自定义操作 */
  suffix?: () => unknown;
}>();

/** 列检查表透传给页面，与 `usePaginatedTable` 的 `columnChecks` 同源。 */
const columns = defineModel<TableColumnCheck[]>('columns', { default: () => [] });

interface Props {
  /** 无选中项时禁用批量删除 */
  disabledDelete?: boolean;
  /** 拉取中，刷新图标转圈 */
  loading?: boolean;
  /** 批量删除确认文案里的选中条数 */
  deleteCount?: number;
}

interface Emits {
  add: [];
  delete: [];
  refresh: [];
}

const { t } = useI18n();

function onAdd() {
  emit('add');
}

function onBatchDelete() {
  emit('delete');
}

function onRefresh() {
  emit('refresh');
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <slot />

    <SButtonIcon icon="lucide:plus" variant="soft" :aria-label="t('common.add')" @click="onAdd" />

    <SPopconfirm
      :title="t('common.batchDeleteConfirm', { count: deleteCount })"
      :confirm-text="t('common.confirm')"
      :cancel-text="t('common.cancel')"
      :disabled="disabledDelete"
      @confirm="onBatchDelete"
    >
      <SButtonIcon
        icon="lucide:trash-2"
        variant="soft"
        color="destructive"
        :disabled="disabledDelete"
        :aria-label="t('common.batchDelete')"
      />
    </SPopconfirm>

    <SButtonIcon
      icon="lucide:rotate-cw"
      variant="soft"
      :aria-label="t('common.refresh')"
      :icon-class="{ 'animate-spin': loading }"
      @click="onRefresh"
    />

    <TableColumnSetting v-model:columns="columns" />

    <slot name="suffix" />
  </div>
</template>
