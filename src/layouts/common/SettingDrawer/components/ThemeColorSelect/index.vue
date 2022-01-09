<template>
  <n-divider title-placement="center">系统主题</n-divider>
  <n-grid :cols="8" :x-gap="8" :y-gap="12">
    <n-grid-item v-for="color in theme.themeColorList" :key="color" class="flex-x-center">
      <color-checkbox :color="color" :checked="color === theme.themeColor" @click="theme.setThemeColor(color)" />
    </n-grid-item>
  </n-grid>
  <n-button :block="true" :type="otherColorBtnType" class="mt-12px" @click="openModal">更多颜色</n-button>
  <color-modal :visible="visible" @close="closeModal" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { NDivider, NGrid, NGridItem, NButton } from 'naive-ui';
import { useThemeStore } from '@/store';
import { useBoolean } from '@/hooks';
import { ColorCheckbox, ColorModal } from './components';

const theme = useThemeStore();

const { bool: visible, setTrue: openModal, setFalse: closeModal } = useBoolean();

const isInOther = computed(() => !theme.themeColorList.includes(theme.themeColor));
const otherColorBtnType = computed(() => (isInOther.value ? 'primary' : 'default'));
</script>
<style scoped></style>
