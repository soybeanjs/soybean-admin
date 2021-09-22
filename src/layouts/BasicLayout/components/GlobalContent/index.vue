<template>
  <n-layout-content class="flex-auto p-10px" :class="{ 'bg-[#f5f7f9]': !theme.darkMode }">
    <router-view v-slot="{ Component, route }">
      <transition :name="theme.pageStyle.animateType" mode="out-in" appear>
        <keep-alive :include="cacheRoutes">
          <component :is="Component" v-if="reload" :key="route.fullPath" />
        </keep-alive>
      </transition>
    </router-view>
  </n-layout-content>
</template>

<script lang="ts" setup>
import { NLayoutContent } from 'naive-ui';
import { useThemeStore } from '@/store';
import { useReloadInject } from '@/context';
import { cacheRoutes } from '@/router';

const theme = useThemeStore();
const { reload } = useReloadInject();
</script>
<style scoped></style>
