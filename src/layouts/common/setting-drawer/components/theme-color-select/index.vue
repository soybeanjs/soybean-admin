<template>
  <n-divider title-placement="center">{{ $t('layout.settingDrawer.systemThemeTitle') }}</n-divider>
  <n-grid :cols="8" :x-gap="8" :y-gap="12">
    <n-grid-item v-for="color in theme.themeColorList" :key="color" class="flex-x-center">
      <color-checkbox :color="color" :checked="color === theme.themeColor" @click="theme.setThemeColor(color)" />
    </n-grid-item>
  </n-grid>
  <n-space :vertical="true" class="pt-12px">
    <n-color-picker :value="theme.themeColor" :show-alpha="false" @update-value="theme.setThemeColor" />
    <n-button :block="true" :type="otherColorBtnType" @click="openModal">
      {{ $t('layout.settingDrawer.systemTheme.moreColors') }}
    </n-button>
  </n-space>
  <color-modal :visible="visible" @close="closeModal" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { isInTraditionColors } from '@/settings';
import { useThemeStore } from '@/store';
import { useBoolean } from '@/hooks';
import { $t } from '@/locales';
import { ColorCheckbox, ColorModal } from './components';

defineOptions({ name: 'ThemeColorSelect' });

const theme = useThemeStore();

const { bool: visible, setTrue: openModal, setFalse: closeModal } = useBoolean();

const isInOther = computed(() => isInTraditionColors(theme.themeColor));
const otherColorBtnType = computed(() => (isInOther.value ? 'primary' : 'default'));
</script>

<style scoped></style>
