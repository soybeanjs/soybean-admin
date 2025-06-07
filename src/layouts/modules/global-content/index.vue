<script setup lang="ts">
import type { VNode } from 'vue';
import { computed, defineAsyncComponent, reactive, shallowRef, watch } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import { LAYOUT_SCROLL_EL_ID } from '@sa/materials';
import { router as globalRouter } from '@/router';
import { useAppStore } from '@/store/modules/app';
import { useThemeStore } from '@/store/modules/theme';
import { useRouteStore } from '@/store/modules/route';
import { useTabStore } from '@/store/modules/tab';

defineOptions({
  name: 'GlobalContent'
});

interface Props {
  /** Show padding for content */
  showPadding?: boolean;
}

withDefaults(defineProps<Props>(), {
  showPadding: true
});

const appStore = useAppStore();
const themeStore = useThemeStore();
const routeStore = useRouteStore();
const tabStore = useTabStore();

const transitionName = computed(() => (themeStore.page.animate ? themeStore.page.animateMode : ''));

function resetScroll() {
  const el = document.querySelector(`#${LAYOUT_SCROLL_EL_ID}`);

  el?.scrollTo({ left: 0, top: 0 });
}

function isIframeComponent(component: VNode) {
  const extraProps = { ...(component.type as Record<string, any>) };
  return extraProps.name === 'iframe-page';
}

// Cache the loaded iFrame components
const iFrameComponentCache = shallowRef<Map<string, any>>(new Map());

const iFrameTabReloadFlags = reactive(
  routeStore.iFrameRoutes.reduce((tabReloadFlagMap, route) => {
    tabReloadFlagMap.set(route.name, appStore.reloadFlag);
    return tabReloadFlagMap;
  }, new Map())
);

function iframeComponent(route: RouteRecordRaw) {
  const routeName = `${route?.name?.toString()}`;
  if (route?.name && !iFrameComponentCache.value.get(routeName)) {
    if (typeof route.component === 'function') {
      const component = defineAsyncComponent(route.component as () => Promise<any>);
      iFrameComponentCache.value.set(routeName, component);
    }
  }
  return iFrameComponentCache.value.get(routeName);
}

// Calculate the list of iFrame components that need to be show
const visibleIFrames = computed(() => {
  return routeStore.iFrameRoutes.filter(
    route =>
      globalRouter.currentRoute.value.name === route.name ||
      iFrameComponentCache.value.get(`${route?.name?.toString()}`)
  );
});

// Listen for route changes and load iFrame components as needed
watch(
  () => globalRouter.currentRoute.value,
  newRoute => {
    routeStore.iFrameRoutes.forEach(route => {
      if (newRoute.name === route.name && !iFrameComponentCache.value.get(`${route?.name?.toString()}`)) {
        iframeComponent(route);
      }
    });
  },
  { immediate: true }
);
// Listens for refresh operations and refreshes only the current iFrame component
watch(
  () => appStore.reloadFlag,
  reloadFlag => {
    const tabKey = globalRouter.currentRoute.value.name;
    iFrameTabReloadFlags.set(tabKey, reloadFlag);
  },
  { immediate: true }
);
</script>

<template>
  <RouterView v-slot="{ Component, route }">
    <Transition
      :name="transitionName"
      mode="out-in"
      @before-leave="appStore.setContentXScrollable(true)"
      @after-leave="resetScroll"
      @after-enter="appStore.setContentXScrollable(false)"
    >
      <KeepAlive :include="routeStore.cacheRoutes" :exclude="routeStore.excludeCacheRoutes">
        <component
          :is="Component"
          v-if="appStore.reloadFlag && !isIframeComponent(Component)"
          :key="tabStore.getTabIdByRoute(route)"
          :class="{ 'p-16px': showPadding }"
          class="flex-grow bg-layout transition-300"
        />
      </KeepAlive>
    </Transition>
  </RouterView>

  <template v-for="route in visibleIFrames" :key="route.name">
    <component
      :is="iframeComponent(route)"
      v-show="globalRouter.currentRoute.value.name === route.name"
      v-if="iFrameTabReloadFlags.get(route.name)"
      v-bind="route?.props as Record<string, any>"
      :class="{ 'p-8px': showPadding }"
      class="flex-grow bg-layout transition-300"
    />
  </template>
</template>

<style></style>
