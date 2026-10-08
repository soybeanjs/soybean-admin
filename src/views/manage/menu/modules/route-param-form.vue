<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { SButtonIcon, SInput } from '@vean/ui';

/**
 * 路由参数 / 查询编辑器（P3-03）。
 *
 * 值域是 `Record<string, string>`（后端 `routeParams` / `routeQueries` 的 DTO 形
 * 状）。行内编辑用局部数组，避免每次按键都重建 record 造成父级表单抖动；
 * 回写用 `JSON.stringify` 比对，防止 `watch` 来回互相触发。
 */
defineOptions({ name: 'RouteParamForm' });

const props = defineProps<{
  /** 新增按钮的文案（`manage.menu.addParam` / `manage.menu.addQuery`） */
  addLabel: string;
}>();

const modelValue = defineModel<Record<string, string>>('modelValue', { default: () => ({}) });

const { t } = useI18n();

interface ParamRow {
  key: string;
  value: string;
}

const rows = ref<ParamRow[]>([]);

function toRows(record: Record<string, string>): ParamRow[] {
  return Object.entries(record).map(([key, value]) => ({ key, value }));
}

function toRecord(list: ParamRow[]): Record<string, string> {
  const record: Record<string, string> = {};

  for (const row of list) {
    if (row.key) {
      record[row.key] = row.value;
    }
  }

  return record;
}

function onAdd(index: number) {
  rows.value.splice(index + 1, 0, { key: '', value: '' });
}

function onRemove(index: number) {
  rows.value.splice(index, 1);
}

watch(
  () => modelValue.value,
  value => {
    if (JSON.stringify(toRecord(rows.value)) !== JSON.stringify(value ?? {})) {
      rows.value = toRows(value ?? {});
    }
  },
  { immediate: true }
);

watch(
  rows,
  value => {
    const next = toRecord(value);

    if (JSON.stringify(next) !== JSON.stringify(modelValue.value ?? {})) {
      modelValue.value = next;
    }
  },
  { deep: true }
);
</script>

<template>
  <div class="w-full">
    <div class="flex items-center gap-2 pb-2 text-sm">
      <span class="w-40%">{{ t('manage.menu.paramName') }}</span>
      <span class="w-40%">{{ t('manage.menu.paramValue') }}</span>
      <span class="whitespace-nowrap">{{ t('common.actions') }}</span>
    </div>

    <div v-for="(row, index) in rows" :key="index" class="flex items-center gap-2 pb-2">
      <SInput v-model="row.key" :placeholder="t('manage.menu.paramName')" class="w-40%" />
      <SInput v-model="row.value" :placeholder="t('manage.menu.paramValue')" class="w-40%" />
      <div class="flex items-center gap-1">
        <SButtonIcon icon="lucide:trash-2" variant="ghost" size="sm" color="destructive" @click="onRemove(index)" />
        <SButtonIcon icon="lucide:plus" variant="ghost" size="sm" @click="onAdd(index)" />
      </div>
    </div>

    <SButtonIcon
      v-if="!rows.length"
      icon="lucide:plus"
      variant="ghost"
      size="sm"
      :title="props.addLabel"
      @click="onAdd(-1)"
    />
  </div>
</template>
