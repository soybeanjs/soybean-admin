<template>
  <n-divider title-placement="center">主题模式</n-divider>
  <n-space vertical size="large">
    <setting-menu label="深色主题">
      <n-switch :value="theme.darkMode" @update:value="theme.setDarkMode">
        <template #checked>
          <icon-mdi-white-balance-sunny class="text-14px text-white" />
        </template>
        <template #unchecked>
          <icon-mdi-moon-waning-crescent class="text-14px text-white" />
        </template>
      </n-switch>
    </setting-menu>
    <setting-menu label="跟随系统">
      <n-switch :value="theme.followSystemTheme" @update:value="theme.setFollowSystemTheme">
        <template #checked>
          <icon-ic-baseline-do-not-disturb class="text-14px text-white" />
        </template>
        <template #unchecked>
          <icon-ic-round-hdr-auto class="text-14px text-white" />
        </template>
      </n-switch>
    </setting-menu>
    <setting-menu label="侧边栏深色">
      <n-switch :value="theme.sider.inverted" @update:value="theme.setSiderInverted" />
    </setting-menu>
    <setting-menu label="头部深色">
      <n-switch :value="theme.header.inverted" @update:value="theme.setHeaderInverted" />
    </setting-menu>
    <setting-menu label="底部深色">
      <n-switch :value="theme.footer.inverted" @update:value="theme.setFooterInverted" />
    </setting-menu>
  </n-space>
</template>

<script lang="ts" setup>
import { useThemeStore } from '@/store';
import SettingMenu from '../setting-menu/index.vue';

defineOptions({ name: 'DarkMode' });

const theme = useThemeStore();
</script>
<style scoped></style>
