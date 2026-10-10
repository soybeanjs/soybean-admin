<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { SCard, useTheme } from '@vean/ui';
import JsBarcode from 'jsbarcode';
import type { Options } from 'jsbarcode';

/**
 * 条形码演示（P4-01）。
 *
 * JsBarcode 直接写 SVG 元素的子节点，必须在元素挂载后调用；明暗切换时重新
 * 生成 —— 有几组配置用了固定深色，深色背景下会看不见。
 */
defineOptions({ name: 'PluginBarcode' });

const { t } = useI18n();
const { effectiveMode } = useTheme();

interface CodeConfig {
  id: string;
  title: string;
  text: string;
  options: Options;
}

const codes: CodeConfig[] = [
  { id: 'code39', title: 'CODE 39 正常尺寸', text: 'Hello', options: { format: 'code39' } },
  { id: 'code128', title: 'CODE 128 正常尺寸', text: 'Soybean', options: {} },
  { id: 'ean-13', title: 'ENA-13 商品条形码', text: '1234567890128', options: { format: 'ean13' } },
  { id: 'upc-a', title: 'UPC-A 商品条形码', text: '123456789012', options: { format: 'upc' } },
  {
    id: 'barcode',
    title: '不一样的高度，不一样的颜色',
    text: 'Hello',
    options: { height: 30, lineColor: '#9ca3af' }
  },
  { id: 'barcode1', title: '加个背景色', text: 'Soybean', options: { background: '#9ca3af', lineColor: '#ffffff' } },
  { id: 'barcode2', title: '字体好大', text: 'Soybean', options: { fontSize: 40 } },
  { id: 'barcode3', title: '粗狂的条码，文字离远点', text: 'Hi', options: { textMargin: 30, width: 4 } },
  {
    id: 'barcode4',
    title: '字体跑上面来，还是粗体',
    text: 'Soybean',
    options: { textPosition: 'top', fontOptions: 'bold' }
  }
];

function generateBarcode() {
  codes.forEach(code => {
    JsBarcode(`#${code.id}`, code.text, code.options);
  });
}

onMounted(() => {
  generateBarcode();
});

watch(effectiveMode, () => {
  generateBarcode();
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <SCard :title="t('plugin.barcode')">
      <div class="grid grid-cols-1 gap-x-3 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="item in codes" :key="item.id" class="flex flex-col items-center gap-2">
          <h3 class="text-sm font-medium">{{ item.title }}</h3>
          <svg :id="item.id" class="h-32" />
        </div>
      </div>
    </SCard>
  </div>
</template>
