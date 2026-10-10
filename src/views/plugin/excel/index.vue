<script setup lang="tsx">
import { computed, onMounted, ref, shallowRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { SButton, SCard, STable, STag, toast } from '@vean/ui';
import type { TableColumn } from '@vean/ui';
import { utils, writeFile } from 'xlsx';
import { fetchUserList } from '@/service/api/user';
import type { UserRow } from '@/service/api/user';

/**
 * Excel 导出演示（P4-01）。
 *
 * 与 v2 的差异：
 * - 数据来自**真实接口**（`/api/user/list`，一次性取 999 条），不是假数组 ——
 *   导出的表格就是用户管理页看到的东西；
 * - xlsx 的 `aoa_to_sheet` 需要纯文本二维数组，枚举值（启用状态）先经 i18n
 *   转成可读文案再写入，否则导出的是 `Y` / `N`；
 * - `!cols` 宽度按各列字符数估算，不写死像素。
 */
defineOptions({ name: 'PluginExcel' });

const { t } = useI18n();

const loading = ref(false);
const rows = shallowRef<UserRow[]>([]);

/** 导出用的列（与界面列同源，`enabled` 转文案） */
const exportColumns = computed(
  () =>
    [
      { key: 'username', title: 'username' },
      { key: 'fullName', title: 'fullName' },
      { key: 'phone', title: 'phone' },
      { key: 'email', title: 'email' },
      { key: 'enabled', title: 'enabled' },
      { key: 'homePath', title: 'homePath' }
    ] as const
);

const columns = computed<TableColumn<UserRow>[]>(() => [
  { type: 'index', header: '#' },
  { accessorKey: 'username', header: t('manage.user.username') },
  { accessorKey: 'fullName', header: t('manage.user.fullName') },
  { accessorKey: 'phone', header: t('manage.user.phone') },
  { accessorKey: 'email', header: t('manage.user.email') },
  { accessorKey: 'enabled', header: t('manage.field.enabled') },
  { accessorKey: 'homePath', header: t('manage.user.homePath') }
]);

function enabledLabel(value: UserRow['enabled']) {
  if (value === 'Y') return t('common.enabled');
  if (value === 'N') return t('common.disabled');
  return 'Deleted';
}

async function load() {
  loading.value = true;

  const data = await fetchUserList({ page: 1, pageSize: 999 });

  loading.value = false;

  rows.value = data.list ?? [];
}

/** 单元格取值：`enabled` 走 i18n，其余直接取字符串 */
function cellValue(row: UserRow, key: (typeof exportColumns.value)[number]['key']): string {
  if (key === 'enabled') {
    return enabledLabel(row.enabled);
  }

  return row[key] ?? '';
}

function exportExcel() {
  if (rows.value.length === 0) {
    toast.warning(t('plugin.excelEmpty'));
    return;
  }

  const header = exportColumns.value.map(column => column.title);
  const body = rows.value.map(row => exportColumns.value.map(column => cellValue(row, column.key)));
  const sheet = utils.aoa_to_sheet([header, ...body]);

  sheet['!cols'] = exportColumns.value.map(column => ({
    width:
      Math.max(column.title.length, ...body.map(line => String(line[exportColumns.value.indexOf(column)]).length)) + 2
  }));

  const book = utils.book_new();
  utils.book_append_sheet(book, sheet, t('plugin.excelSheetName'));
  writeFile(book, t('plugin.excelFileName'));
}

function rowKey(row: UserRow) {
  return row.id;
}

onMounted(() => {
  void load();
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <SCard :title="t('plugin.excel')" :description="t('plugin.excelExport')">
      <template #extra>
        <SButton size="sm" :disabled="loading" @click="exportExcel">
          {{ t('plugin.excelExport') }}
        </SButton>
      </template>

      <STable :columns="columns" :data="rows" :loading="loading" :row-key="rowKey" class="max-h-120">
        <template #enabled="{ value }">
          <STag :color="value === 'Y' ? 'success' : 'warning'" variant="soft">{{ enabledLabel(value) }}</STag>
        </template>
      </STable>
    </SCard>
  </div>
</template>
