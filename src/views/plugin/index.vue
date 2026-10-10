<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { SAlert, SCard, SIcon, SLink } from '@vean/ui';
import { getRouter } from '@/router/instance';

/**
 * plugin 演示总入口（P4-01，v3 §5.8）。
 *
 * 侧栏里 plugin 是一棵树（分组靠 `meta.menuParent`），本页只是给「点父级菜单」
 * 之外的入口一个可用落地页：按分组列出全部子页，点击直达。
 *
 * 链接清单与 `src/pages/plugin/**` 一一对应；这里刻意用静态数组而不是从
 * `getRouter().getRoutes()` 反查 —— 演示页的导航顺序是人工编排的，反射出来的
 * 顺序会跟着 meta.order 变，反而不稳定。
 */
defineOptions({ name: 'PluginIndex' });

const { t } = useI18n();
const router = getRouter();

interface PluginLink {
  /** 路由 path */
  path: string;
  /** 展示文案：直接存 `t()` 结果，本仓 `\`test/remove-i18n.test.ts\`` 禁动态 key */
  label: string;
  icon: string;
}

interface PluginGroup {
  title: string;
  links: PluginLink[];
}

const groups: PluginGroup[] = [
  {
    title: t('plugin.charts'),
    links: [
      { path: '/plugin/charts/echarts', label: t('route.pluginChartsEcharts'), icon: 'simple-icons:apacheecharts' },
      { path: '/plugin/charts/vchart', label: t('route.pluginChartsVchart'), icon: 'mdi:chart-line-variant' },
      { path: '/plugin/charts/antv', label: t('route.pluginChartsAntv'), icon: 'mdi:graph-outline' }
    ]
  },
  {
    title: t('plugin.editor'),
    links: [
      { path: '/plugin/editor/markdown', label: t('route.pluginEditorMarkdown'), icon: 'mdi:language-markdown' },
      {
        path: '/plugin/editor/rich-text',
        label: t('route.pluginEditorRichText'),
        icon: 'mdi:file-document-edit-outline'
      }
    ]
  },
  {
    title: t('plugin.vtable'),
    links: [{ path: '/plugin/vtable', label: t('route.pluginVtable'), icon: 'mdi:table-large' }]
  },
  {
    title: t('plugin.gantt'),
    links: [
      { path: '/plugin/gantt/dhtmlx', label: t('route.pluginGanttDhtmlx'), icon: 'mdi:chart-timeline-variant' },
      { path: '/plugin/gantt/vtable', label: t('route.pluginGanttVtable'), icon: 'mdi:table-clock' }
    ]
  },
  {
    title: t('plugin.more'),
    links: [
      { path: '/plugin/copy', label: t('route.pluginCopy'), icon: 'mdi:clipboard-outline' },
      { path: '/plugin/icon', label: t('route.pluginIcon'), icon: 'mdi:emoticon-outline' },
      { path: '/plugin/excel', label: t('route.pluginExcel'), icon: 'mdi:microsoft-excel' },
      { path: '/plugin/pdf', label: t('route.pluginPdf'), icon: 'mdi:file-pdf-box' },
      { path: '/plugin/print', label: t('route.pluginPrint'), icon: 'mdi:printer' },
      { path: '/plugin/barcode', label: t('route.pluginBarcode'), icon: 'mdi:barcode' },
      { path: '/plugin/pinyin', label: t('route.pluginPinyin'), icon: 'mdi:translate' },
      { path: '/plugin/video', label: t('route.pluginVideo'), icon: 'mdi:video' },
      { path: '/plugin/map', label: t('route.pluginMap'), icon: 'mdi:map' },
      { path: '/plugin/swiper', label: t('route.pluginSwiper'), icon: 'mdi:view-carousel-outline' },
      { path: '/plugin/typeit', label: t('route.pluginTypeit'), icon: 'mdi:typewriter' }
    ]
  }
];

function go(path: string) {
  void router.push(path);
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <SAlert variant="soft" color="primary" :title="t('plugin.title')" :description="t('plugin.pluginTip')" />

    <SCard v-for="group in groups" :key="group.title" :title="group.title">
      <div class="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        <SLink
          v-for="link in group.links"
          :key="link.path"
          class="flex items-center gap-2 rounded-md border border-solid border-border px-3 py-2 hover:bg-muted"
          @click.prevent="go(link.path)"
        >
          <SIcon :icon="link.icon" class="shrink-0 text-lg" />
          <span class="truncate text-sm">{{ link.label }}</span>
        </SLink>
      </div>
    </SCard>
  </div>
</template>
