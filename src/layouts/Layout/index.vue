<template>
  <div class="h-full">
    <h3>Layout</h3>
    <router-view v-slot="{ Component }">
      <transition name="fade-slide" mode="out-in" appear>
        <component :is="Component" v-if="app.reloadFlag" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store';

const app = useAppStore();
</script>
<style scoped></style>
