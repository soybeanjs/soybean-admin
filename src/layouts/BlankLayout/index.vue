<template>
  <n-scrollbar ref="scrollbar" class="h-full" :content-class="routeProps.fullPage ? 'h-full' : ''">
    <div class="inline-block wh-full bg-[#f6f9f8] dark:bg-dark">
      <router-view v-slot="{ Component, route: itemRoute }">
        <transition :name="theme.pageAnimateType" mode="out-in" appear>
          <keep-alive :include="cacheRoutes">
            <component
              :is="Component"
              v-if="app.reloadFlag"
              :key="itemRoute.fullPath"
              :class="{ 'min-h-100vh': !routeProps.fullPage }"
            />
          </keep-alive>
        </transition>
      </router-view>
    </div>
  </n-scrollbar>
</template>

<script lang="ts" setup>
import { NScrollbar } from 'naive-ui';
import { useThemeStore, useAppStore } from '@/store';
import { cacheRoutes } from '@/router';
import { useRouteProps } from '@/composables';

const theme = useThemeStore();
const app = useAppStore();

const routeProps = useRouteProps();
</script>
<style scoped></style>
