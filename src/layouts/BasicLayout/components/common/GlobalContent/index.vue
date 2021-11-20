<template>
  <div class="flex-1-hidden bg-[#f6f9f8] dark:bg-deep-dark p-16px transition-all duration-300 ease-in-out">
    <div class="min-h-full" :class="{ 'h-full overflow-hidden': routeProps.fullPage }">
      <router-view v-slot="{ Component, route }">
        <transition :name="theme.pageAnimateType" mode="out-in" appear>
          <keep-alive :include="cacheRoutes">
            <component
              :is="Component"
              v-if="app.reloadFlag"
              :key="route.fullPath"
              :class="{ 'h-full': routeProps.fullPage }"
            />
          </keep-alive>
        </transition>
      </router-view>
    </div>
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
