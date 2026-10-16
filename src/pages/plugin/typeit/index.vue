<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { SCard } from '@vean/ui';
import TypeIt from 'typeit';
import type { Options } from 'typeit';
import PluginDocLinks from '../modules/plugin-doc-links.vue';
import type { DocLink } from '../modules/types';

/** 打字机演示（P4-01） 详见 docs/v3-notes.md N-372。 */
defineOptions({ name: 'PluginTypeit' });

const { t } = useI18n();

/** 文档链接（模板属性里的多行数组字面量会被 vue-tsc 误判，提到脚本里） */
const TYPEIT_DOC_LINKS: DocLink[] = [
  { label: 'GitHub', href: 'https://github.com/alexmacarthur/typeit' },
  { label: 'Docs', href: 'https://www.typeitjs.com/docs/vanilla/usage/' }
];

const textRef = useTemplateRef<HTMLElement>('textRef');

let typeit: TypeIt | null = null;

onMounted(() => {
  if (!textRef.value) {
    return;
  }

  const options: Options = {
    strings: 'SoybeanAdmin 是一个清新优雅、高颜值且功能强大的后台管理模板',
    lifeLike: true,
    speed: 120,
    loop: true
  };

  typeit = new TypeIt(textRef.value, options);
  typeit.go();
});

onUnmounted(() => {
  typeit?.destroy();
  typeit = null;
});

definePage({
  meta: {
    title: '打字机',
    i18nKey: 'route.pluginTypeit',
    icon: 'mdi:typewriter',
    order: 57,
    menuParent: 'PluginIndex'
  }
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <SCard :title="t('plugin.typeit')">
      <div class="flex flex-col gap-4">
        <PluginDocLinks :links="TYPEIT_DOC_LINKS" />
        <p ref="textRef" class="min-h-8 text-lg" />
      </div>
    </SCard>
  </div>
</template>
