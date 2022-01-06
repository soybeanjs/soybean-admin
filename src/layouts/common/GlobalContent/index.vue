<template>
  <router-view v-slot="{ Component }">
    <transition name="fade-slide" mode="out-in" appear>
      <component :is="Component" v-if="app.reloadFlag" />
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store';

const app = useAppStore();
</script>
<style scoped></style>
