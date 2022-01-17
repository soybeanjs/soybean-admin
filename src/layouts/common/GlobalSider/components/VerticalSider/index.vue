<template>
  <dark-mode-container class="flex-col-stretch h-full">
    <global-logo v-if="!isHorizontalMix" :show-title="showTitle" :style="{ height: theme.header.height + 'px' }" />
    <vertical-menu />
  </dark-mode-container>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { DarkModeContainer } from '@/components';
import { useAppStore, useThemeStore } from '@/store';
import { GlobalLogo } from '@/layouts/common';
import { VerticalMenu } from './components';

const app = useAppStore();
const theme = useThemeStore();

const isHorizontalMix = computed(() => theme.layout.mode === 'horizontal-mix');
const showTitle = computed(() => !app.siderCollapse && theme.layout.mode !== 'vertical-mix');
</script>
<style scoped></style>
