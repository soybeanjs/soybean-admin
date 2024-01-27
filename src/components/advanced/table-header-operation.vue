<script setup lang="ts">
import type { FilteredColumn } from '@/hooks/common/table';

defineOptions({
  name: 'TableHeaderOperation'
});

interface Props {
  disabledDelete?: boolean;
  loading?: boolean;
}

defineProps<Props>();

interface Emits {
  (e: 'add'): void;
  (e: 'delete'): void;
  (e: 'refresh'): void;
}

const emit = defineEmits<Emits>();

const columns = defineModel<FilteredColumn[]>('columns', {
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
</script>

<template>
  <NSpace wrap justify="end" class="<sm:w-200px">
    <NButton size="small" ghost type="primary" @click="add">
      <template #icon>
        <icon-ic-round-plus class="text-icon" />
      </template>
      {{ $t('common.add') }}
    </NButton>
    <NPopconfirm @positive-click="batchDelete">
      <template #trigger>
        <NButton size="small" ghost type="error" :disabled="disabledDelete">
          <template #icon>
            <icon-ic-round-delete class="text-icon" />
          </template>
          {{ $t('common.batchDelete') }}
        </NButton>
      </template>
      {{ $t('common.confirmDelete') }}
    </NPopconfirm>
    <NButton size="small" @click="refresh">
      <template #icon>
        <icon-mdi-refresh class="text-icon" :class="{ 'animate-spin': loading }" />
      </template>
      {{ $t('common.refresh') }}
    </NButton>
    <TableColumnSetting v-model:columns="columns" />
  </NSpace>
</template>

<style scoped></style>
