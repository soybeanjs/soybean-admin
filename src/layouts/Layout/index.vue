<template>
  <div class="h-full">
    <router-view v-slot="{ Component }">
      <transition name="fade-slide" mode="out-in" appear>
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts"></script>
<style scoped></style>
