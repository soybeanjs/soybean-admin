<script setup lang="ts">
import { resetCacheStrategyOptions, themeTabModeOptions } from '@/constants/app';
import { useThemeStore } from '@/store/modules/theme';
import { translateOptions } from '@/utils/common';
import { $t } from '@/locales';
import SettingItem from '../../../components/setting-item.vue';

defineOptions({
  name: 'TabSettings'
});

const themeStore = useThemeStore();
</script>

<template>
  <NDivider>{{ $t('theme.layout.tab.title') }}</NDivider>
  <TransitionGroup tag="div" name="setting-list" class="flex-col-stretch gap-12px">
    <SettingItem key="0" :label="$t('theme.layout.resetCacheStrategy.title')">
      <NSelect
        v-model:value="themeStore.resetCacheStrategy"
        :options="translateOptions(resetCacheStrategyOptions)"
        size="small"
        class="w-120px"
      />
    </SettingItem>
    <SettingItem key="1" :label="$t('theme.layout.tab.visible')">
      <NSwitch v-model:value="themeStore.tab.visible" />
    </SettingItem>
    <SettingItem v-if="themeStore.tab.visible" key="2" :label="$t('theme.layout.tab.cache')">
      <NSwitch v-model:value="themeStore.tab.cache" />
    </SettingItem>
    <SettingItem v-if="themeStore.tab.visible" key="3" :label="$t('theme.layout.tab.height')">
      <NInputNumber v-model:value="themeStore.tab.height" size="small" :step="1" class="w-120px" />
    </SettingItem>
    <SettingItem v-if="themeStore.tab.visible" key="4" :label="$t('theme.layout.tab.mode.title')">
      <NSelect
        v-model:value="themeStore.tab.mode"
        :options="translateOptions(themeTabModeOptions)"
        size="small"
        class="w-120px"
      />
    </SettingItem>
  </TransitionGroup>
</template>

<style scoped>
.setting-list-move,
.setting-list-enter-active,
.setting-list-leave-active {
  --uno: transition-all-300;
}

.setting-list-enter-from,
.setting-list-leave-to {
  --uno: opacity-0 -translate-x-30px;
}

.setting-list-leave-active {
  --uno: absolute;
}
</style>
