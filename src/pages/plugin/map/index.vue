<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Component } from 'vue';
import { useI18n } from 'vue-i18n';
import { SCard, STabs } from '@vean/ui';
import { BaiduMap, GaodeMap, TencentMap } from './components';

/** 与 v2 的差异： 详见 docs/v3-notes.md N-362。 */
defineOptions({ name: 'PluginMap' });

const { t } = useI18n();

interface MapTab {
  value: string;
  label: string;
  component: Component;
}

/** 三张地图，值为 SDK 名 详见 docs/v3-notes.md N-363。 */
const maps: MapTab[] = [
  { value: 'gaode', label: '高德地图', component: GaodeMap },
  { value: 'tencent', label: '腾讯地图', component: TencentMap },
  { value: 'baidu', label: '百度地图', component: BaiduMap }
];

const items = computed(() => maps.map(({ value, label }) => ({ value, label })));

const activeMap = ref('gaode');

/** 当前选中的地图组件（模板里不写内联箭头） */
const activeMapComponent = computed(() => maps.find(item => item.value === activeMap.value)?.component);

definePage({
  meta: {
    title: '地图',
    i18nKey: 'route.pluginMap',
    icon: 'mdi:map',
    order: 55,
    menuParent: 'PluginIndex'
  }
});
</script>

<template>
  <SCard :title="t('plugin.map')">
    <STabs v-model="activeMap" :items="items">
      <template #content>
        <div class="h-150 w-full pt-3">
          <component :is="activeMapComponent" />
        </div>
      </template>
    </STabs>
  </SCard>
</template>
