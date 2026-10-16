<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { STag } from '@vean/ui';
import { ENABLED_TAG_COLORS } from '@/constants/manage';

/** 文案按值**穷举**成静态字面量 key，不能写成 `t(ENABLED_LABEL_KEYS[props.enabled])`： 详见 docs/v3-notes.md N-029。 */
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
