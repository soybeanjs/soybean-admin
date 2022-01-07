<template>
  <soybean-layout :mode="mode" :fixed-header-and-tab="fixed" :fixed-footer="fixedFooter" :sider-collapse="collapse">
    <template #header>
      <div class="flex justify-end h-full bg-red-600">
        <h3 class="text-white">Header</h3>
      </div>
    </template>
    <template #tab>
      <div class="h-full bg-green-600"></div>
    </template>
    <template #sider>
      <div class="w-full h-full bg-gray-200">
        <n-space :vertical="true" align="center" class="pt-24px">
          <n-button type="primary" @click="toggle">折叠</n-button>
          <div>
            <span class="pr-12px">固定头部和标签</span>
            <n-switch v-model:value="fixed" />
          </div>
          <div>
            <span class="pr-12px">固定底部</span>
            <n-switch v-model:value="fixedFooter" />
          </div>
          <div>
            <span class="pr-12px">vertical布局</span>
            <n-radio-group v-model:value="mode">
              <n-radio v-for="item in radios" :key="item.value" :value="item.value">
                {{ item.label }}
              </n-radio>
            </n-radio-group>
          </div>
        </n-space>
      </div>
    </template>
    <global-content />
    <template #footer>
      <div class="h-full bg-blue-400">
        <h3>footer</h3>
      </div>
    </template>
  </soybean-layout>
  <setting-drawer />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { NSpace, NButton, NSwitch, NRadioGroup, NRadio } from 'naive-ui';
import { useElementSize } from '@vueuse/core';
import { useBoolean } from '@/hooks';
import { SoybeanLayout } from '@/package';
import { SettingDrawer, GlobalContent } from '../common';

type LayoutMode = 'vertical' | 'horizontal';

interface ModeRadio {
  value: LayoutMode;
  label: string;
}

const { width } = useElementSize(document.documentElement);
const { bool: collapse, toggle } = useBoolean();

const minWidthOfLayout = 1200;

const fixed = ref(true);
const fixedFooter = ref(true);
const mode = ref<LayoutMode>('vertical');

const radios: ModeRadio[] = [
  { value: 'vertical', label: 'vertical' },
  { value: 'horizontal', label: 'horizontal' }
];

watch(width, newValue => {
  if (newValue < minWidthOfLayout) {
    document.documentElement.style.overflowX = 'auto';
  } else {
    document.documentElement.style.overflowX = 'hidden';
  }
});
</script>
<style scoped></style>
