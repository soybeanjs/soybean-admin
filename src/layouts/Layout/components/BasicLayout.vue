<template>
  <div class="flex flex-col h-full">
    <header
      :class="{ 'fixed-lt': topFixed }"
      :style="{ height: headerHeight + 'px', paddingLeft: headerPaddingLeft }"
      class="z-1001 flex-shrink-0 w-full bg-white border-b border-gray-200 transition-all duration-300 ease-in-out"
    >
      <slot name="header">
        <h3>Header</h3>
      </slot>
    </header>
    <div
      :class="{ fixed: topFixed }"
      :style="{ top: headerHeight + 'px', height: tabHeight + 'px', paddingLeft: siderWidth }"
      class="left-0 z-999 flex-shrink-0 w-full bg-white border-b border-gray-200 transition-all duration-300 ease-in-out"
    >
      <slot name="tab">
        <div>Tab</div>
      </slot>
    </div>
    <aside
      :style="{ width: siderWidth, paddingTop: siderPaddingTop }"
      :class="[isVertical ? 'z-1002' : 'z-1000']"
      class="fixed-lt h-full transition-all duration-300 ease-in-out bg-white border-r border-gray-200"
    >
      <slot name="sider">
        <n-space :vertical="true" align="center" class="pt-24px">
          <n-button type="primary" @click="toggle">折叠</n-button>
          <div>
            <span class="pr-12px">固定头部和标签</span>
            <n-switch v-model:value="fixed" />
          </div>
          <div>
            <span class="pr-12px">vertical布局</span>
            <n-switch v-model:value="isVertical" />
          </div>
        </n-space>
      </slot>
    </aside>
    <main
      class="flex-1 transition-all duration-300 ease-in-out"
      :style="{ paddingLeft: siderWidth, paddingTop: mainPaddingTop }"
    >
      <slot></slot>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { NSpace, NButton, NSwitch } from 'naive-ui';
import { useBoolean } from '@/hooks';

interface Props {
  /** 头部高度 */
  headerHeight?: number;
  /** 标签页高度 */
  tabHeight?: number;
  /** 固定头部和标签 */
  fixdTop?: boolean;
  /** 侧边栏高度 */
  siderWidth?: number;
  /** 侧边栏折叠状态的高度 */
  siderCollapsedWidth?: number;
  /** 侧边栏折叠状态 */
  siderCollapse?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  headerHeight: 56,
  tabHeight: 44,
  fixdTop: true,
  topZIndex: 1000,
  siderWidth: 200,
  siderZIndex: 1001,
  siderCollapsedWidth: 64,
  siderCollapse: false
});

const { bool: collapse, toggle } = useBoolean();

const fixed = ref(true);
const isVertical = ref(true);

const topFixed = computed(() => fixed.value || !isVertical.value);

const siderWidth = computed(() => `${collapse.value ? props.siderCollapsedWidth : props.siderWidth}px`);
const headerPaddingLeft = computed(() => (isVertical.value ? siderWidth.value : '0px'));
const siderPaddingTop = computed(() => (isVertical.value ? '0px' : `${props.headerHeight}px`));
const mainPaddingTop = computed(() => `${fixed.value ? props.headerHeight + props.tabHeight : 0}px`);
</script>
<style scoped></style>
