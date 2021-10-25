<template>
  <div
    class="flex-1 flex-col-stretch p-16px bg-[#F6F9F8] dark:bg-black"
    :class="{ 'overflow-hidden': routeProps.fullPage }"
  >
    <router-view v-slot="{ Component, route }">
      <transition :name="theme.pageStyle.animateType" mode="out-in" appear>
        <keep-alive :include="cacheRoutes">
          <component :is="Component" v-if="reload" :key="route.fullPath" class="flex-1" />
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>

<script lang="ts" setup>
import { useThemeStore } from '@/store';
import { useReloadInject } from '@/context';
import { cacheRoutes } from '@/router';
import { useRouteProps } from '@/hooks';

const theme = useThemeStore();
const { reload } = useReloadInject();
const routeProps = useRouteProps();
</script>
<style scoped></style>
