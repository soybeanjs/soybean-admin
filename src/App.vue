<template>
  <app-provider>
    <router-view />
  </app-provider>
</template>

<script lang="ts" setup>
import { fetchTestMock } from '@/service';
import AppProvider from './AppProvider.vue';

fetchTestMock();
</script>
<style></style>
