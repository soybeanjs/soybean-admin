<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { SLink } from '@vean/ui';
import type { DocLink } from './types';

/** 演示页的「外部链接」行（P4-01） 详见 docs/v3-notes.md N-366。 */
defineOptions({ name: 'PluginDocLinks' });

defineProps<{
  links: DocLink[];
}>();

const { t } = useI18n();
</script>

<template>
  <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs opacity-80">
    <SLink v-for="link in links" :key="link.href" :href="link.href" external target="_blank" rel="noopener noreferrer">
      {{ link.label }}
    </SLink>
    <span class="opacity-60">{{ t('plugin.docs') }}</span>
  </div>
</template>
