<script setup lang="ts">
import { $t } from '@/locales';

defineOptions({
  name: 'TableHeaderOperation'
});

interface Props {
  itemAlign?: NaiveUI.Align;
  disabledDelete?: boolean;
  disableAdd?: boolean;
  loading?: boolean;
  showAdd?: boolean;
  showDelete?: boolean;
  showExport?: boolean;
}

withDefaults(defineProps<Props>(), {
  itemAlign: undefined,
  showAdd: true,
  showDelete: true,
  showExport: false
});

interface Emits {
  (e: 'add'): void;
  (e: 'delete'): void;
  (e: 'refresh'): void;
  (e: 'export'): void;
}

const emit = defineEmits<Emits>();

const columns = defineModel<NaiveUI.TableColumnCheck[]>('columns', {
  default: () => []
});

function add() {
  emit('add');
}

function batchDelete() {
  emit('delete');
}

function refresh() {
  emit('refresh');
}

function handleExport() {
  emit('export');
}
</script>

<template>
  <NSpace :align="itemAlign" wrap justify="end" class="lt-sm:w-200px">
    <slot name="prefix"></slot>
    <slot name="default">
      <NButton v-if="showAdd" :disabled="disableAdd" size="small" ghost type="primary" @click="add">
        <template #icon>
          <icon-material-symbols:add class="text-icon" />
        </template>
        {{ $t('common.add') }}
      </NButton>
      <NPopconfirm v-if="showDelete" @positive-click="batchDelete">
        <template #trigger>
          <NButton size="small" ghost type="error" :disabled="disabledDelete">
            <template #icon>
              <icon-material-symbols:delete-outline class="text-icon" />
            </template>
            {{ $t('common.batchDelete') }}
          </NButton>
        </template>
        {{ $t('common.confirmDelete') }}
      </NPopconfirm>
      <NButton v-if="showExport" size="small" ghost @click="handleExport">
        <template #icon>
          <icon-material-symbols:download-rounded class="text-icon" />
        </template>
        {{ $t('common.export') }}
      </NButton>
    </slot>
    <slot name="after"></slot>
    <NButton size="small" @click="refresh">
      <template #icon>
        <icon-material-symbols:refresh-rounded class="text-icon" :class="{ 'animate-spin': loading }" />
      </template>
      {{ $t('common.refresh') }}
    </NButton>
    <TableColumnSetting v-model:columns="columns" />
    <slot name="suffix"></slot>
  </NSpace>
</template>

<style scoped></style>
