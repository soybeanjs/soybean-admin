<script lang="ts" setup>
import { useBoolean } from '@sa/hooks';
import { onMounted, onUnmounted } from 'vue';
import { $t } from '@/locales';
import { useEventBus } from '@/utils/event-bus';
import { useAppStore } from '@/store/modules/app';
import SearchModal from './components/search-modal.vue';

defineOptions({ name: 'GlobalSearch' });

const { bool: show, toggle } = useBoolean();

const eventBus = useEventBus();

const appStore = useAppStore();

const checkShow = () => {
  if (show.value) return;
  if (appStore.themeDrawerVisible) {
    appStore.closeThemeDrawer();
  }
  toggle();
};

onMounted(() => {
  eventBus.on('searchShortcutKey', checkShow);
});

onUnmounted(() => {
  eventBus.off('searchShortcutKey', checkShow);
});
</script>

<template>
  <ButtonIcon :tooltip-content="$t('common.search')" @click="toggle">
    <icon-uil-search />
  </ButtonIcon>
  <SearchModal v-model:show="show" />
</template>

<style lang="scss" scoped></style>
