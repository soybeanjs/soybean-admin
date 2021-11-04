<template>
  <div class="flex-center flex-col wh-full">
    <exception-svg type="500" :color="theme.themeColor" />
    <router-link to="/">
      <n-button type="primary">回到首页</n-button>
    </router-link>
  </div>
</template>

<script lang="ts" setup>
import { NButton } from 'naive-ui';
import { ExceptionSvg } from '@/components';
import { useThemeStore } from '@/store';

const theme = useThemeStore();
</script>
<style scoped></style>
