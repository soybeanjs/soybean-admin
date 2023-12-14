<script setup lang="ts">
import { useAppStore } from '@/store/modules/app';
import { useThemeStore } from '@/store/modules/theme';
import { useRouteStore } from '@/store/modules/route';

defineOptions({
  name: 'GlobalContent'
});

withDefaults(defineProps<Props>(), {
  showPadding: true
});

interface Props {
  /** Show padding for content */
  showPadding?: boolean;
}

const appStore = useAppStore();
const themeStore = useThemeStore();
const routeStore = useRouteStore();
</script>

<template>
  <RouterView v-slot="{ Component, route }">
    <Transition
      :name="themeStore.page.animateMode"
      mode="out-in"
      @before-leave="appStore.setContentXScrollable(true)"
      @after-enter="appStore.setContentXScrollable(false)"
    >
      <KeepAlive :include="routeStore.cacheRoutes">
        <component
          :is="Component"
          v-if="appStore.reloadFlag"
          :key="route.path"
          :class="{ 'p-16px': showPadding }"
          class="flex-grow bg-layout transition-300"
        />
      </KeepAlive>
    </Transition>
  </RouterView>
</template>

<style></style>
