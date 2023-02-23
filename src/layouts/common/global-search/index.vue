<template>
  <div>
    <hover-container
      class="w-40px h-full"
      tooltip-content="搜索"
      :inverted="theme.header.inverted"
      @click="handleSearch"
    >
      <icon-uil-search class="text-20px" />
    </hover-container>
    <search-modal v-model:value="show" />
  </div>
</template>

<script lang="ts" setup>
import { useThemeStore } from '@/store';
import { useBoolean } from '@/hooks';
import { SearchModal } from './components';

defineOptions({ name: 'GlobalSearch' });

const { bool: show, toggle } = useBoolean();
const theme = useThemeStore();

function handleSearch() {
  toggle();
}
</script>

<style lang="scss" scoped></style>
