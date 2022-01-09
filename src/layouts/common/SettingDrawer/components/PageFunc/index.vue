<template>
  <n-divider title-placement="center">界面功能</n-divider>
  <n-space vertical size="large">
    <setting-menu label="固定头部和多页签">
      <n-switch :value="theme.fixedHeaderAndTab" @update:value="setIsFixedHeaderAndTab" />
    </setting-menu>
    <setting-menu label="顶部菜单位置">
      <n-select
        class="w-120px"
        size="small"
        :value="theme.menu.horizontalPosition"
        :options="theme.menu.horizontalPositionList"
        @update:value="setHorizontalMenuPosition"
      />
    </setting-menu>
    <setting-menu label="头部高度">
      <n-input-number
        class="w-120px"
        size="small"
        :value="theme.header.height"
        :step="1"
        @update:value="handleSetNumber($event, setHeaderHeight)"
      />
    </setting-menu>
    <setting-menu label="多页签高度">
      <n-input-number
        class="w-120px"
        size="small"
        :value="theme.tab.height"
        :step="1"
        @update:value="handleSetNumber($event, setTabHeight)"
      />
    </setting-menu>
    <setting-menu label="多页签缓存">
      <n-switch :value="theme.tab.isCache" @update:value="setTabIsCache" />
    </setting-menu>
    <setting-menu label="侧边栏展开宽度">
      <n-input-number
        class="w-120px"
        size="small"
        :value="theme.sider.width"
        :step="10"
        @update:value="handleSetNumber($event, setSiderWidth)"
      />
    </setting-menu>
    <setting-menu label="左侧混合侧边栏展开宽度">
      <n-input-number
        class="w-120px"
        size="small"
        :value="theme.sider.mixWidth"
        :step="5"
        @update:value="handleSetNumber($event, setMixSiderWidth)"
      />
    </setting-menu>
  </n-space>
</template>

<script lang="ts" setup>
import { NDivider, NSpace, NSwitch, NSelect, NInputNumber } from 'naive-ui';
import { useThemeStore } from '@/store';
import SettingMenu from '../SettingMenu/index.vue';

const theme = useThemeStore();
const {
  setHorizontalMenuPosition,
  setIsFixedHeaderAndTab,
  setHeaderHeight,
  setTabHeight,
  setSiderWidth,
  setMixSiderWidth,
  setTabIsCache
} = useThemeStore();

function handleSetNumber(value: number | null, callback: (value: number) => void) {
  if (value !== null) {
    callback(value);
  }
}
</script>
<style scoped></style>
