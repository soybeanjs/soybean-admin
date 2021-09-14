<template>
  <div>
    <h2>工作台</h2>
    <router-link :to="EnumRoutePath['dashboard-analysis']">analysis</router-link>
  </div>
</template>

<script lang="ts" setup>
import { EnumRoutePath } from '@/enum';
</script>
<style scoped></style>
