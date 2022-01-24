<template>
  <div>
    <hover-container tooltip-content="搜索" class="w-40px h-full" @click="handleSearch">
      <icon-uil:search class="text-20px text-[#666]" />
    </hover-container>
    <search-modal v-model:value="show" />
  </div>
</template>

<script lang="ts" setup>
import { HoverContainer } from '@/components';
import { useBoolean } from '@/hooks';
import { SearchModal } from './components';

const { bool: show, toggle } = useBoolean();
function handleSearch() {
  toggle();
}
</script>
<style lang="scss" scoped></style>
