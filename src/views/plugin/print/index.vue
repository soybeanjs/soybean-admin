<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { SButton, SCard } from '@vean/ui';
import printJS from 'print-js';
import PluginDocLinks from '../modules/plugin-doc-links.vue';

/**
 * 打印演示（P4-01）。
 *
 * print-js 两种模式：`type: 'json'` 用 `properties` 指定列打印表格，
 * `type: 'image'` 打印图片列表。都靠新建 iframe 完成，无需额外处理。
 */
defineOptions({ name: 'PluginPrint' });

const { t } = useI18n();

interface PrintRow {
  name: string;
  wechat: string;
  remark: string;
}

const IMAGE_URL = 'https://i.loli.net/2021/11/24/1J6REWXiHomU2kM.jpg';

function printTable() {
  const rows: PrintRow[] = [
    { name: 'soybean', wechat: 'honghuangdc', remark: '欢迎来技术交流' },
    { name: 'soybean', wechat: 'honghuangdc', remark: '欢迎来技术交流' }
  ];

  printJS({
    printable: rows,
    properties: [
      { field: 'name', displayName: 'name' },
      { field: 'wechat', displayName: 'wechat' },
      { field: 'remark', displayName: 'remark' }
    ],
    type: 'json'
  });
}

function printImage() {
  printJS({
    printable: [IMAGE_URL],
    type: 'image',
    header: t('plugin.printHeader'),
    imageStyle: 'width:100%;'
  });
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <SCard :title="t('plugin.print')">
      <div class="flex flex-col gap-4">
        <PluginDocLinks :links="[{ label: 'printJS', href: 'https://github.com/crabbly/Print.js' }]" />
        <div class="flex flex-wrap items-center gap-3">
          <SButton @click="printTable">{{ t('plugin.printTable') }}</SButton>
          <SButton variant="outline" @click="printImage">{{ t('plugin.printImage') }}</SButton>
        </div>
      </div>
    </SCard>
  </div>
</template>
