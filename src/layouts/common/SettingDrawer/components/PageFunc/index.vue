<template>
  <n-divider title-placement="center">界面功能</n-divider>
  <n-space vertical size="large">
    <setting-menu label="侧边栏反转色">
      <n-switch :value="theme.sider.inverted" @update:value="theme.setSiderInverted" />
    </setting-menu>
    <setting-menu label="头部反转色">
      <n-switch :value="theme.header.inverted" @update:value="theme.setHeaderInverted" />
    </setting-menu>
    <setting-menu label="固定头部和多页签">
      <n-switch :value="theme.fixedHeaderAndTab" @update:value="theme.setIsFixedHeaderAndTab" />
    </setting-menu>
    <setting-menu label="顶部菜单位置">
      <n-select
        class="w-120px"
        size="small"
        :value="theme.menu.horizontalPosition"
        :options="theme.menu.horizontalPositionList"
        @update:value="theme.setHorizontalMenuPosition"
      />
    </setting-menu>
    <setting-menu label="头部高度">
      <n-input-number
        class="w-120px"
        size="small"
        :value="theme.header.height"
        :step="1"
        @update:value="theme.setHeaderHeight"
      />
    </setting-menu>
    <setting-menu label="多页签高度">
      <n-input-number
        class="w-120px"
        size="small"
        :value="theme.tab.height"
        :step="1"
        @update:value="theme.setTabHeight"
      />
    </setting-menu>
    <setting-menu label="多页签缓存">
      <n-switch :value="theme.tab.isCache" @update:value="theme.setTabIsCache" />
    </setting-menu>
    <setting-menu label="侧边栏展开宽度">
      <n-input-number
        class="w-120px"
        size="small"
        :value="theme.sider.width"
        :step="10"
        @update:value="theme.setSiderWidth"
      />
    </setting-menu>
    <setting-menu label="左侧混合侧边栏展开宽度">
      <n-input-number
        class="w-120px"
        size="small"
        :value="theme.sider.mixWidth"
        :step="5"
        @update:value="theme.setMixSiderWidth"
      />
    </setting-menu>
    <setting-menu label="固定底部">
      <n-switch :value="theme.footer.fixed" @update:value="theme.setFooterIsFixed" />
    </setting-menu>
    <setting-menu label="显示底部">
      <n-switch :value="theme.footer.visible" @update:value="theme.setFooterVisible" />
    </setting-menu>
  </n-space>
</template>

<script lang="ts" setup>
import { useThemeStore } from '@/store';
import SettingMenu from '../SettingMenu/index.vue';

defineOptions({ name: 'PageFunc' });

const theme = useThemeStore();
</script>

<style scoped></style>
