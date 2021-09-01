<template>
  <div>
    <h3>System</h3>
    <n-button>
      <router-link to="/home">home</router-link>
    </n-button>
    <n-switch :value="true" />
  </div>
</template>

<script lang="ts" setup>
import { NButton, NSwitch } from 'naive-ui';
</script>
<style scoped></style>
