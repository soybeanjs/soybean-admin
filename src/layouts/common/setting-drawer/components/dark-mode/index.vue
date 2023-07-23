<template>
  <n-divider title-placement="center">{{ $t('layout.settingDrawer.themeModeTitle') }}</n-divider>
  <n-space vertical size="large">
    <setting-menu :label="$t('layout.settingDrawer.darkMode')">
      <n-switch :value="theme.darkMode" @update:value="theme.setDarkMode">
        <template #checked>
          <icon-mdi-white-balance-sunny class="text-14px text-white" />
        </template>
        <template #unchecked>
          <icon-mdi-moon-waning-crescent class="text-14px text-white" />
        </template>
      </n-switch>
    </setting-menu>
    <setting-menu :label="$t('layout.settingDrawer.followSystemTheme')">
      <n-switch :value="theme.followSystemTheme" @update:value="theme.setFollowSystemTheme">
        <template #checked>
          <icon-ic-baseline-do-not-disturb class="text-14px text-white" />
        </template>
        <template #unchecked>
          <icon-ic-round-hdr-auto class="text-14px text-white" />
        </template>
      </n-switch>
    </setting-menu>
    <setting-menu :label="$t('layout.settingDrawer.isCustomizeDarkModeTransition')">
      <n-switch :value="theme.isCustomizeDarkModeTransition" @update:value="theme.setIsCustomizeDarkModeTransition">
        <template #checked>
          <icon-ic-baseline-do-not-disturb class="text-14px text-white" />
        </template>
        <template #unchecked>
          <icon-ic-round-hdr-auto class="text-14px text-white" />
        </template>
      </n-switch>
    </setting-menu>
    <setting-menu :label="$t('layout.settingDrawer.sider.inverted')">
      <n-switch :value="theme.sider.inverted" @update:value="theme.setSiderInverted" />
    </setting-menu>
    <setting-menu :label="$t('layout.settingDrawer.header.inverted')">
      <n-switch :value="theme.header.inverted" @update:value="theme.setHeaderInverted" />
    </setting-menu>
    <setting-menu :label="$t('layout.settingDrawer.footer.inverted')">
      <n-switch :value="theme.footer.inverted" @update:value="theme.setFooterInverted" />
    </setting-menu>
  </n-space>
</template>

<script lang="ts" setup>
import { useThemeStore } from '@/store';
import { $t } from '@/locales';
import SettingMenu from '../setting-menu/index.vue';

defineOptions({ name: 'DarkMode' });

const theme = useThemeStore();
</script>
<style scoped></style>
