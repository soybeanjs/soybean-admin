<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { SCard } from '@vean/ui';
import { pinyin } from 'pinyin-pro';
import PluginDocLinks from '../modules/plugin-doc-links.vue';
import type { DocLink } from '../modules/types';

/** 拼音标注演示（P4-01） 详见 docs/v3-notes.md N-369。 */
defineOptions({ name: 'PluginPinyin' });

const { t } = useI18n();

/** 文档链接（模板属性里的多行数组字面量会被 vue-tsc 误判，提到脚本里） */
const PINYIN_DOC_LINKS: DocLink[] = [
  { label: 'GitHub', href: 'https://github.com/zh-lx/pinyin-pro' },
  { label: 'Docs', href: 'https://pinyin-pro.cn/' }
];

const TEXT = 'SoybeanAdmin 是一个清新优雅、高颜值且功能强大的后台管理模板';

interface PinyinToken {
  origin: string;
  pinyin: string;
  isHan: boolean;
}

/** `type: 'all'` 的返回项里带 `isZh`，用它区分"有注音"和"纯符号" */
function toTokens(text: string): PinyinToken[] {
  return pinyin(text, { type: 'all' }).map(item => ({
    origin: item.origin,
    pinyin: item.pinyin,
    isHan: item.isZh
  }));
}

const normalTokens = computed(() => toTokens(TEXT));

/** 不带音调：`toneType: 'none'` */
const noToneTokens = computed(() =>
  pinyin(TEXT, { type: 'all', toneType: 'none' }).map(item => ({
    origin: item.origin,
    pinyin: item.pinyin,
    isHan: item.isZh
  }))
);

definePage({
  meta: {
    title: '拼音',
    i18nKey: 'route.pluginPinyin',
    icon: 'mdi:translate',
    order: 53,
    menuParent: 'PluginIndex'
  }
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <SCard :title="t('plugin.pinyin')">
      <PluginDocLinks :links="PINYIN_DOC_LINKS" />
    </SCard>

    <SCard :title="t('plugin.pinyinNormal')">
      <p class="flex flex-wrap gap-x-1 text-lg">
        <span v-for="(token, index) in normalTokens" :key="index" class="inline-flex flex-col items-center">
          <span class="text-xs text-primary">{{ token.pinyin }}</span>
          <span>{{ token.origin }}</span>
        </span>
      </p>
    </SCard>

    <SCard :title="t('plugin.pinyinNoTone')">
      <p class="flex flex-wrap gap-x-1 text-lg">
        <span v-for="(token, index) in noToneTokens" :key="index" class="inline-flex flex-col items-center">
          <span class="text-xs text-primary">{{ token.pinyin }}</span>
          <span>{{ token.origin }}</span>
        </span>
      </p>
    </SCard>

    <SCard :title="t('plugin.pinyinCustom')">
      <p class="flex flex-wrap gap-x-1 text-lg">
        <span v-for="(token, index) in normalTokens" :key="index" class="inline-flex flex-col items-center">
          <span v-if="token.isHan" class="text-xs text-error">{{ token.pinyin }}</span>
          <span :class="token.isHan ? '' : 'text-primary'">{{ token.origin }}</span>
        </span>
      </p>
    </SCard>
  </div>
</template>
