<template>
  <div class="flex w-full h-full">
    <div class="flex-center w-1/2 h-full">
      <h3>登录</h3>
    </div>
    <div class="flex-center w-1/2 h-full bg-primary bg-opacity-25">
      <banner-svg class="w-400px h-400px" type="1" :color="theme.themeColor" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { BannerSvg } from '@/components';
import { useThemeStore } from '@/store';

const theme = useThemeStore();
</script>
<style scoped></style>
