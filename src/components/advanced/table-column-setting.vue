<script setup lang="ts" generic="T extends Record<string, unknown>, K = never">
import { computed } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';
import { $t } from '@/locales';

defineOptions({
  name: 'TableColumnSetting'
});

const columns = defineModel<NaiveUI.TableColumnCheck[]>('columns', {
  required: true
});

const tooltipRecord: Record<NaiveUI.TableColumnFixed, App.I18n.I18nKey> = {
  left: 'datatable.fixed.right',
  right: 'datatable.fixed.unFixed',
  unFixed: 'datatable.fixed.left'
};

function handleFixed(column: NaiveUI.TableColumnCheck) {
  const fixedOptions: NaiveUI.TableColumnFixed[] = ['left', 'right', 'unFixed'];
  const index = fixedOptions.findIndex(item => item === column.fixed);
  const nextIndex = index === fixedOptions.length - 1 ? 0 : index + 1;
  column.fixed = fixedOptions[nextIndex];
}

const visibleStats = computed(() => {
  let total = 0;
  let checked = 0;

  columns.value.forEach(column => {
    if (!column.visible) return;

    total += 1;
    if (column.checked) checked += 1;
  });

  return { total, checked };
});

const selectAllChecked = computed(() => {
  const { total, checked } = visibleStats.value;

  return total > 0 && checked === total;
});

const selectAllIndeterminate = computed(() => {
  const { total, checked } = visibleStats.value;

  return checked > 0 && checked < total;
});

function toggleSelectAll(checked: boolean) {
  columns.value.forEach(column => {
    if (!column.visible) return;

    column.checked = checked;
  });
}
</script>

<template>
  <NPopover placement="bottom-end" trigger="click">
    <template #trigger>
      <NButton size="small">
        <template #icon>
          <icon-ant-design-setting-outlined class="text-icon" />
        </template>
        {{ $t('common.columnSetting') }}
      </NButton>
    </template>
    <div>
      <div class="h-36px flex-y-center rd-4px pl-26px hover:(bg-primary bg-opacity-20)">
        <NCheckbox
          :checked="selectAllChecked"
          :indeterminate="selectAllIndeterminate"
          :disabled="visibleStats.total === 0"
          class="flex-1"
          @update:checked="toggleSelectAll"
        >
          {{ $t('common.selectAll') }}
        </NCheckbox>
      </div>
      <NDivider class="!my-4px" />
      <VueDraggable v-model="columns" :animation="150" filter=".none_draggable" class="max-h-[200px] overflow-y-auto">
        <div
          v-for="item in columns"
          :key="item.key"
          class="h-36px flex-y-center justify-between gap-6px"
          :class="{ hidden: !item.visible }"
        >
          <div class="h-full flex-y-center flex-1 rd-4px hover:(bg-primary bg-opacity-20)">
            <icon-mdi-drag class="mr-8px h-full cursor-move text-icon" />
            <NCheckbox v-model:checked="item.checked" class="none_draggable flex-1">
              <template v-if="typeof item.title === 'function'">
                <component :is="item.title" />
              </template>
              <template v-else>{{ item.title }}</template>
            </NCheckbox>
          </div>
          <ButtonIcon
            :disabled="!item.checked"
            :focusable="false"
            :tooltip-content="$t(tooltipRecord[item.fixed!])"
            @click="handleFixed(item)"
          >
            <icon-octicon-pin-16 v-if="item.fixed === 'unFixed'" />
            <icon-octicon-pin-16 v-else-if="item.fixed === 'left'" class="rotate-270" />
            <icon-octicon-pin-slash-16 v-else />
          </ButtonIcon>
        </div>
      </VueDraggable>
    </div>
  </NPopover>
</template>

<style scoped></style>
