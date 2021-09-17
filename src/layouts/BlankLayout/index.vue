<template>
  <n-scrollbar ref="scrollbar" class="h-full" :x-scrollable="true" :content-class="routeProps.fullPage ? 'h-full' : ''">
    <div class="inline-block w-full" :class="[routeProps.fullPage ? 'h-full' : 'min-h-100vh']">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" v-if="routeProps.keepAlive" :key="routeProps.name" />
        </keep-alive>
        <component :is="Component" v-if="!routeProps.keepAlive" :key="routeProps.name" />
      </router-view>
    </div>
  </n-scrollbar>
</template>

<script lang="ts" setup>
import { NScrollbar } from 'naive-ui';
import { useRouteProps, useScrollBehavior } from '../composables';

const { scrollbar } = useScrollBehavior();
const routeProps = useRouteProps();
</script>
<style scoped></style>
