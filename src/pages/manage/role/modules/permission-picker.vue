<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { SButton, SDialog, SInput, STable, STag } from '@vean/ui';
import type { TableColumn } from '@vean/ui';
import type { PermissionResource } from '@/schema/permission';

/** 权限点选择器（P3-03，角色弹窗内嵌） 详见 docs/v3-notes.md N-328。 */
defineOptions({ name: 'PermissionPicker' });

const props = defineProps<{
  /** 全量权限点（`GET /api/permission/all`） */
  permissions: PermissionResource[];
}>();

const emit = defineEmits<{
  confirm: [ids: string[]];
}>();

const open = defineModel<boolean>('open', { required: true });
/** 外部已选权限 id（确认后才回写） */
const selectedIds = defineModel<string[]>('selectedIds', { default: () => [] });

const { t } = useI18n();

const keyword = ref('');
const draft = ref<string[]>([]);

const columns = computed<TableColumn<PermissionResource>[]>(() => [
  { type: 'selection' },
  { accessorKey: 'name', header: t('manage.permission.name') },
  { accessorKey: 'code', header: t('manage.permission.code') },
  { accessorKey: 'resourceType', header: t('manage.permission.resourceType') }
]);

const filtered = computed(() => {
  const text = keyword.value.trim().toLowerCase();

  if (!text) {
    return props.permissions;
  }

  return props.permissions.filter(
    row => row.name.toLowerCase().includes(text) || row.code.toLowerCase().includes(text)
  );
});

function resourceTypeLabel(type: PermissionResource['resourceType']) {
  if (type === 'menu') return t('manage.resourceType.menu');
  if (type === 'api') return t('manage.resourceType.api');
  if (type === 'button') return t('manage.resourceType.button');
  return t('manage.resourceType.other');
}

function rowKey(row: PermissionResource) {
  return row.id;
}

/** 全选当前**过滤后**的行（用户期望"全选"= 全选眼前这些） */
function onSelectAll() {
  const ids = new Set(draft.value);

  for (const row of filtered.value) {
    ids.add(row.id);
  }

  draft.value = [...ids];
}

function onClear() {
  draft.value = [];
}

function onConfirm() {
  selectedIds.value = draft.value;
  emit('confirm', draft.value);
  open.value = false;
}

watch(open, value => {
  if (value) {
    draft.value = [...selectedIds.value];
    keyword.value = '';
  }
});
</script>

<template>
  <SDialog v-model:open="open" :title="t('manage.role.pickPermission')" class="max-w-3xl">
    <div class="flex flex-col gap-3">
      <div class="flex items-center gap-3">
        <SInput v-model="keyword" :placeholder="t('manage.search')" class="flex-1" />
        <STag variant="soft" color="primary">{{ t('manage.role.permissionCount', { count: draft.length }) }}</STag>
      </div>

      <STable v-model:selected="draft" :columns="columns" :data="filtered" :row-key="rowKey" class="max-h-100">
        <template #resourceType="{ value }">
          {{ resourceTypeLabel(value) }}
        </template>
      </STable>
    </div>

    <template #footer>
      <div class="flex w-full items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <SButton variant="outline" size="sm" @click="onSelectAll">{{ t('common.selectAll') }}</SButton>
          <SButton variant="outline" size="sm" @click="onClear">{{ t('common.reset') }}</SButton>
        </div>
        <div class="flex items-center gap-3">
          <SButton variant="outline" @click="open = false">{{ t('common.cancel') }}</SButton>
          <SButton @click="onConfirm">{{ t('common.confirm') }}</SButton>
        </div>
      </div>
    </template>
  </SDialog>
</template>
