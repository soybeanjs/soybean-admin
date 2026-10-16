<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { SCard, SClipboard, SEmpty, SIcon, SLink } from '@vean/ui';
import { icons } from './icons';

/** 集合（也没有自定义图标选择器组件），所以这里只做两件事： 详见 docs/v3-notes.md N-357。 */
defineOptions({ name: 'PluginIcon' });

/** icones 站点的地址（卡片副标题与外部链接共用） */
const ICONES_URL = 'https://icones.js.org/';

const { t } = useI18n();

/** 常用图标写法（复制按钮的取值） */
const usage = `<SIcon icon="mdi:emoticon" class="text-lg" />
<icon-mdi-emoticon class="text-lg" />`;

definePage({
  meta: {
    title: '图标',
    i18nKey: 'route.pluginIcon',
    icon: 'mdi:emoticon-outline',
    order: 41,
    menuParent: 'PluginIndex'
  }
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <SCard :title="t('plugin.icon')" :description="ICONES_URL">
      <div class="grid grid-cols-6 gap-4 sm:grid-cols-8 lg:grid-cols-10">
        <div v-for="icon in icons" :key="icon" class="flex flex-col items-center gap-1">
          <SIcon :icon="icon" class="text-3xl" />
          <span class="w-full truncate text-center text-[10px] opacity-60">{{ icon }}</span>
        </div>
      </div>
    </SCard>

    <SCard title="用法">
      <div class="flex flex-col gap-3">
        <pre
          class="overflow-x-auto rounded-md border border-solid border-border p-3 text-xs"
        ><code>{{ usage }}</code></pre>
        <div class="flex flex-wrap items-center gap-3">
          <SClipboard :value="usage" />
          <SLink :href="ICONES_URL" external target="_blank" rel="noopener noreferrer" class="text-xs">
            {{ t('plugin.docs') }}icones.js.org
          </SLink>
        </div>
      </div>
    </SCard>

    <SCard title="空状态">
      <SEmpty icon="mdi:emoticon-sad-outline" title="Empty" description="SEmpty 的默认插画占位" />
    </SCard>
  </div>
</template>
