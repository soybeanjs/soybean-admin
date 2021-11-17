<template>
  <div class="p-16px" :class="{ 'router-view_full-page_height': routeProps.fullPage }">
    <router-view v-slot="{ Component, route }">
      <transition :name="theme.pageAnimateType" mode="out-in" appear>
        <keep-alive :include="cacheRoutes">
          <component :is="Component" v-if="reload" :key="route.fullPath" :class="{ 'h-full': routeProps.fullPage }" />
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useThemeStore } from '@/store';
import { useReloadInject } from '@/context';
import { cacheRoutes } from '@/router';
import { useRouteProps } from '@/hooks';

const theme = useThemeStore();
const { reload } = useReloadInject();
const routeProps = useRouteProps();

const routeViewFullPageHeight = computed(() => {
  const {
    multiTabStyle: { visible, height: tH },
    headerStyle: { height: hH },
    footerStyle: { height: fH }
  } = theme;
  const height = visible ? tH + hH + fH : hH + fH;
  return `calc(100% - ${height}px)`;
});
</script>
<style scoped>
.router-view_full-page_height {
  height: v-bind(routeViewFullPageHeight);
}
</style>
