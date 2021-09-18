<template>
  <app-provider>
    <router-view />
  </app-provider>
</template>

<script lang="ts" setup>
import { setupAppContext } from '@/context';
import AppProvider from './AppProvider.vue';

setupAppContext();
</script>
<style></style>
