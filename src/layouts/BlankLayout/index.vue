<template>
  <n-scrollbar ref="scrollbar" class="h-full" :content-style="scrollbarContentStyle">
    <global-content :show-padding="false" />
  </n-scrollbar>
</template>

<script lang="ts" setup>
import { NScrollbar } from 'naive-ui';
import { useLayoutConfig } from '@/composables';
import { GlobalContent } from '../common';

const { scrollbarContentStyle } = useLayoutConfig();
</script>
<style scoped></style>
