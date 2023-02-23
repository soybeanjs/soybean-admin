<template>
  <div
    :class="{ 'p-16px': showPadding }"
    class="h-full bg-[#f6f9f8] dark:bg-[#101014] transition duration-300 ease-in-out"
  >
    <router-view v-slot="{ Component, route }">
      <transition :name="theme.pageAnimateMode" mode="out-in" :appear="true">
        <keep-alive :include="routeStore.cacheRoutes">
          <component :is="Component" v-if="app.reloadFlag" :key="route.fullPath" />
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { useAppStore, useRouteStore, useThemeStore } from '@/store';

defineOptions({ name: 'GlobalContent' });

interface Props {
  /** 显示padding */
  showPadding?: boolean;
}

withDefaults(defineProps<Props>(), {
  showPadding: true
});

const app = useAppStore();
const theme = useThemeStore();
const routeStore = useRouteStore();
</script>

<style scoped></style>
