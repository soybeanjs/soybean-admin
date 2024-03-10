<script lang="ts" setup>
import { useBoolean } from '@sa/hooks';
import { $t } from '@/locales';
import SearchModal from './components/search-modal.vue';

defineOptions({ name: 'GlobalSearch' });

const { bool: show, toggle } = useBoolean();
function handleSearch() {
  toggle();
}
</script>

<template>
  <ButtonIcon :tooltip-content="$t('common.search')" @click="handleSearch">
    <icon-uil-search />
  </ButtonIcon>
  <SearchModal v-model:show="show" />
</template>

<style lang="scss" scoped></style>
