<template>
  <div class="h-full">
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </div>
</template>

<script setup lang="ts"></script>
<style scoped></style>
