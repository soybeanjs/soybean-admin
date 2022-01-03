<template>
  <div>
    <h4>Layout</h4>
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </div>
</template>

<script setup lang="ts"></script>
<style scoped></style>
