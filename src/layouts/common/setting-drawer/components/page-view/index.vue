<template>
  <n-divider title-placement="center">{{ $t('layout.settingDrawer.pageViewTitle') }}</n-divider>
  <n-space vertical size="large">
    <setting-menu :label="$t('layout.settingDrawer.header.crumb.visible')">
      <n-switch :value="theme.header.crumb.visible" @update:value="theme.setHeaderCrumbVisible" />
    </setting-menu>
    <setting-menu :label="$t('layout.settingDrawer.header.crumb.icon')">
      <n-switch :value="theme.header.crumb.showIcon" @update:value="theme.setHeaderCrumbIconVisible" />
    </setting-menu>
    <setting-menu :label="$t('layout.settingDrawer.tab.visible')">
      <n-switch :value="theme.tab.visible" @update:value="theme.setTabVisible" />
    </setting-menu>
    <setting-menu :label="$t('layout.settingDrawer.tab.modeList.mode')">
      <n-select
        class="w-120px"
        size="small"
        :value="theme.tab.mode"
        :options="theme.tab.modeList"
        @update:value="theme.setTabMode"
      />
    </setting-menu>
    <setting-menu :label="$t('layout.settingDrawer.page.animate')">
      <n-switch :value="theme.page.animate" @update:value="theme.setPageIsAnimate" />
    </setting-menu>
    <setting-menu :label="$t('layout.settingDrawer.page.animateMode')">
      <n-select
        class="w-120px"
        size="small"
        :value="theme.page.animateMode"
        :options="theme.page.animateModeList"
        @update:value="theme.setPageAnimateMode"
      />
    </setting-menu>
  </n-space>
</template>

<script lang="ts" setup>
import { useThemeStore } from '@/store';
import { $t } from '@/locales';
import SettingMenu from '../setting-menu/index.vue';

defineOptions({ name: 'PageView' });

const theme = useThemeStore();
</script>

<style scoped></style>
