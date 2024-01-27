<script setup lang="ts">
import { fetchGetRoleList } from '@/service/api';

fetchGetRoleList().then(res => {
  console.log(res);
});
</script>

<template>
  <LookForward />
</template>

<style scoped></style>
