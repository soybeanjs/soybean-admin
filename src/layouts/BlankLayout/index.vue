<template>
  <n-scrollbar ref="scrollbar" class="h-full" :x-scrollable="true" :content-class="fullPage ? 'h-full' : ''">
    <div class="inline-block w-full" :class="[fullPage ? 'h-full' : 'min-h-100vh']">
      <router-view />
    </div>
  </n-scrollbar>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { NScrollbar } from 'naive-ui';
import { computed } from 'vue';
import { useScrollBehavior } from '@/hooks';

const route = useRoute();
const { scrollbar, resetScrollWatcher } = useScrollBehavior();

/** 100%视高 */
const fullPage = computed(() => Boolean(route.meta?.fullPage));

resetScrollWatcher();
</script>
<style scoped></style>
