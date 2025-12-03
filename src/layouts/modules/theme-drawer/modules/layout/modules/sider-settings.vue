<script setup lang="ts">
import { computed } from 'vue';
import { useThemeStore } from '@/store/modules/theme';
import { $t } from '@/locales';
import SettingItem from '../../../components/setting-item.vue';

defineOptions({
  name: 'SiderSettings'
});

const themeStore = useThemeStore();

const layoutMode = computed(() => themeStore.layout.mode);
const isMixLayoutMode = computed(() => layoutMode.value.includes('mix') || layoutMode.value.includes('hybrid'));
const isHybridLayoutMode = computed(() => layoutMode.value.includes('hybrid'));
</script>

<template>
  <NDivider>{{ $t('theme.layout.sider.title') }}</NDivider>
  <TransitionGroup tag="div" name="setting-list" class="flex-col-stretch gap-12px">
    <SettingItem v-if="layoutMode === 'vertical'" key="1" :label="$t('theme.layout.sider.width')">
      <NInputNumber v-model:value="themeStore.sider.width" size="small" :step="1" class="w-120px" />
    </SettingItem>
    <SettingItem v-if="layoutMode === 'vertical'" key="2" :label="$t('theme.layout.sider.collapsedWidth')">
      <NInputNumber v-model:value="themeStore.sider.collapsedWidth" size="small" :step="1" class="w-120px" />
    </SettingItem>
    <SettingItem v-if="isMixLayoutMode" key="3" :label="$t('theme.layout.sider.mixWidth')">
      <NInputNumber v-model:value="themeStore.sider.mixWidth" size="small" :step="1" class="w-120px" />
    </SettingItem>
    <SettingItem v-if="isMixLayoutMode" key="4" :label="$t('theme.layout.sider.mixCollapsedWidth')">
      <NInputNumber v-model:value="themeStore.sider.mixCollapsedWidth" size="small" :step="1" class="w-120px" />
    </SettingItem>
    <SettingItem v-if="layoutMode === 'vertical-mix'" key="5" :label="$t('theme.layout.sider.mixChildMenuWidth')">
      <NInputNumber v-model:value="themeStore.sider.mixChildMenuWidth" size="small" :step="1" class="w-120px" />
    </SettingItem>
    <SettingItem v-if="isHybridLayoutMode" key="6" :label="$t('theme.layout.sider.autoSelectFirstMenu')">
      <template #suffix>
        <IconTooltip :desc="$t('theme.layout.sider.autoSelectFirstMenuTip')" />
      </template>
      <NSwitch v-model:value="themeStore.sider.autoSelectFirstMenu" />
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
