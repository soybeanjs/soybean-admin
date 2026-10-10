<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { SCard } from '@vean/ui';
import { PluginGroup } from '../modules';

/** 编辑器分组落地页（P4-01）。 */
defineOptions({ name: 'PluginEditorIndex' });

const { t } = useI18n();

const links = [
  { path: '/plugin/editor/markdown', label: t('route.pluginEditorMarkdown'), icon: 'mdi:language-markdown' },
  { path: '/plugin/editor/rich-text', label: t('route.pluginEditorRichText'), icon: 'mdi:file-document-edit-outline' }
];
</script>

<template>
  <SCard :title="t('route.pluginEditor')">
    <PluginGroup :description="t('plugin.editorTip')" :links="links" />
  </SCard>
</template>
