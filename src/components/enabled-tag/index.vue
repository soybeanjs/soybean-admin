<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { STag } from '@vean/ui';
import { ENABLED_TAG_COLORS } from '@/constants/manage';

/**
 * 启用状态标签（P3-03）。
 *
 * 值域 `Y`/`N`/`D`（见 `src/db/schema/shared.ts` 的 `enabledColumn`）。8 套 CRUD
 * 表格共用，避免每页重复一份颜色/文案映射。
 *
 * 文案按值**穷举**成静态字面量 key，不能写成 `t(ENABLED_LABEL_KEYS[props.enabled])`：
 * `scripts/remove-i18n` 只内联字面量 key，动态调用会留下无法裁剪的 `useI18n`
 * 装配（`test/remove-i18n.test.ts` 断言 `plan.leftovers === []`）。
 */
defineOptions({ name: 'EnabledTag' });

const props = defineProps<{
  enabled: 'Y' | 'N' | 'D';
}>();

const { t } = useI18n();

const color = computed(() => ENABLED_TAG_COLORS[props.enabled] ?? 'carbon');

const label = computed(() => {
  if (props.enabled === 'Y') return t('common.enabled');
  if (props.enabled === 'N') return t('common.disabled');

  return t('manage.enabledDeleted');
});
</script>

<template>
  <STag variant="outline" :color="color">{{ label }}</STag>
</template>
