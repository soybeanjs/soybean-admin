<template>
  <div
    class="flex-1 flex-col-stretch bg-[#f6f9f8] dark:bg-deep-dark p-16px transition-all duration-300 ease-in-out"
    :class="{ 'overflow-hidden': routeProps.fullPage }"
  >
    <router-view v-slot="{ Component, route }">
      <transition :name="theme.pageAnimateType" mode="out-in" appear>
        <keep-alive :include="cacheRoutes">
          <component :is="Component" v-if="app.reloadFlag" :key="route.fullPath" class="flex-1" />
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { cacheRoutes } from '@/router';
import { useAppStore, useThemeStore } from '@/store';
import { useRouteProps } from '@/composables';

const theme = useThemeStore();
const app = useAppStore();
const routeProps = useRouteProps();
</script>
<style scoped></style>
