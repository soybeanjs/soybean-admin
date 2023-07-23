<template>
  <n-divider title-placement="center">{{ $t('layout.settingDrawer.pageFunctionsTitle') }}</n-divider>
  <n-space vertical size="large">
    <setting-menu :label="$t('layout.settingDrawer.scrollMode')">
      <n-select
        class="w-120px"
        size="small"
        :value="theme.scrollMode"
        :options="theme.scrollModeList"
        @update:value="theme.setScrollMode"
      />
    </setting-menu>
    <setting-menu :label="$t('layout.settingDrawer.fixedHeaderAndTab')">
      <n-switch :value="theme.fixedHeaderAndTab" @update:value="theme.setIsFixedHeaderAndTab" />
    </setting-menu>
    <setting-menu :label="$t('layout.settingDrawer.menu.horizontalPosition')">
      <n-select
        class="w-120px"
        size="small"
        :value="theme.menu.horizontalPosition"
        :options="theme.menu.horizontalPositionList"
        @update:value="theme.setHorizontalMenuPosition"
      />
    </setting-menu>
    <setting-menu :label="$t('layout.settingDrawer.header.height')">
      <n-input-number
        class="w-120px"
        size="small"
        :value="theme.header.height"
        :step="1"
        @update:value="theme.setHeaderHeight"
      />
    </setting-menu>
    <setting-menu :label="$t('layout.settingDrawer.tab.height')">
      <n-input-number
        class="w-120px"
        size="small"
        :value="theme.tab.height"
        :step="1"
        @update:value="theme.setTabHeight"
      />
    </setting-menu>
    <setting-menu :label="$t('layout.settingDrawer.tab.isCache')">
      <n-switch :value="theme.tab.isCache" @update:value="theme.setTabIsCache" />
    </setting-menu>
    <setting-menu :label="$t('layout.settingDrawer.sider.width')">
      <n-input-number
        class="w-120px"
        size="small"
        :value="theme.sider.width"
        :step="10"
        @update:value="theme.setSiderWidth"
      />
    </setting-menu>
    <setting-menu :label="$t('layout.settingDrawer.sider.mixWidth')">
      <n-input-number
        class="w-120px"
        size="small"
        :value="theme.sider.mixWidth"
        :step="5"
        @update:value="theme.setMixSiderWidth"
      />
    </setting-menu>
    <setting-menu :label="$t('layout.settingDrawer.footer.visible')">
      <n-switch :value="theme.footer.visible" @update:value="theme.setFooterVisible" />
    </setting-menu>
    <setting-menu :label="$t('layout.settingDrawer.footer.fixed')">
      <n-switch :value="theme.footer.fixed" @update:value="theme.setFooterIsFixed" />
    </setting-menu>
    <setting-menu :label="$t('layout.settingDrawer.footer.right')">
      <n-switch :value="theme.footer.right" @update:value="theme.setFooterIsRight" />
    </setting-menu>
  </n-space>
</template>

<script lang="ts" setup>
import { useThemeStore } from '@/store';
import { $t } from '@/locales';
import SettingMenu from '../setting-menu/index.vue';

defineOptions({ name: 'PageFunc' });

const theme = useThemeStore();
</script>

<style scoped></style>
