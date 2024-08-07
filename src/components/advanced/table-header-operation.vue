<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useAuth } from '@/hooks/business/auth';
import { $t } from '@/locales';

defineOptions({
  name: 'TableHeaderOperation'
});

interface Props {
  itemAlign?: NaiveUI.Align;
  disabledDelete?: boolean;
  loading?: boolean;
  showAdd?: boolean;
  addCode?: string; // Button Add Permission Code
  showDelete?: boolean;
  deleteCode?: string; // Button Delete Permission Code
}

const props = withDefaults(defineProps<Props>(), {
  itemAlign: 'center',
  disabledDelete: false,
  loading: false,
  showAdd: true,
  addCode: '',
  showDelete: true,
  deleteCode: ''
});

interface Emits {
  (e: 'add'): void;
  (e: 'delete'): void;
  (e: 'refresh'): void;
}

const { hasAuth } = useAuth();

const showAddButton = ref(false);
const showDeleteButton = ref(false);

// Monitor changes in permission codes and update the display status of buttons
watchEffect(() => {
  showAddButton.value = props.showAdd && (!props.addCode || hasAuth(props.addCode));
  showDeleteButton.value = props.showDelete && (!props.deleteCode || hasAuth(props.deleteCode));
});

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
</script>

<template>
  <NSpace :align="itemAlign" wrap justify="end" class="lt-sm:w-200px">
    <slot name="prefix"></slot>
    <slot name="default">
      <NButton v-if="showAddButton" size="small" ghost type="primary" @click="add">
        <template #icon>
          <icon-ic-round-plus class="text-icon" />
        </template>
        {{ $t('common.add') }}
      </NButton>
      <NPopconfirm v-if="showDeleteButton" @positive-click="batchDelete">
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
    </slot>
    <NButton size="small" @click="refresh">
      <template #icon>
        <icon-mdi-refresh class="text-icon" :class="{ 'animate-spin': loading }" />
      </template>
      {{ $t('common.refresh') }}
    </NButton>
    <TableColumnSetting v-model:columns="columns" />
    <slot name="suffix"></slot>
  </NSpace>
</template>

<style scoped></style>
