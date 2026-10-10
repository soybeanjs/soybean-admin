<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Component } from 'vue';
import { useI18n } from 'vue-i18n';
import { SCard, STabs } from '@vean/ui';
import { BaiduMap, GaodeMap, TencentMap } from './components';

/**
 * 地图插件（P4-01）。
 *
 * 与 v2 的差异：
 * - `NTabs type="line"` → `STabs`（`items` 必填，面板内容走 `#content` 插槽）；
 * - 地图容器给固定高度：三方 SDK 都要**有尺寸的**容器才肯渲染，v2 靠布局撑满，
 *   这里写死 `h-150` 避免在无 `h-full` 上下文的页面里塌成 0；
 * - SDK 加载与地图实例由各子组件自己管（`useScriptTag` 按 URL 去重）。
 */
defineOptions({ name: 'PluginMap' });

const { t } = useI18n();

interface MapTab {
  value: string;
  label: string;
  component: Component;
}

/**
 * 三张地图，值为 SDK 名。
 *
 * 三个子组件都会挂载（`STabs` 的内容面板按 `hidden` 切换），地图 SDK 各自注入；
 * `useScriptTag` 内部按 `script[src]` 去重，切换 tab 不会重复下载。
 */
const maps: MapTab[] = [
  { value: 'gaode', label: '高德地图', component: GaodeMap },
  { value: 'tencent', label: '腾讯地图', component: TencentMap },
  { value: 'baidu', label: '百度地图', component: BaiduMap }
];

const items = computed(() => maps.map(({ value, label }) => ({ value, label })));

const activeMap = ref('gaode');

/** 当前选中的地图组件（模板里不写内联箭头） */
const activeMapComponent = computed(() => maps.find(item => item.value === activeMap.value)?.component);
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
