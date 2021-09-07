<template>
  <router-link to="/" class="nowrap-hidden flex-center h-64px">
    <img src="@/assets/img/common/logo.png" alt="" class="w-32px h-32px" />
    <h2 v-show="showTitle" class="pl-8px text-16px text-primary font-bold">{{ title }}</h2>
  </router-link>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useAppStore } from '@/store';

const app = useAppStore();
const showTitle = computed(() => !app.menu.collapsed);
const title = import.meta.env.VITE_APP_TITLE as string;
</script>
<style scoped></style>
