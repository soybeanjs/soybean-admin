<template>
  <n-space :vertical="true" :size="16">
    <n-grid :x-gap="16" :y-gap="16" :item-responsive="true" responsive="screen">
      <n-grid-item span="s:24 m:16">
        <shadow-card class="h-360px"></shadow-card>
      </n-grid-item>
      <n-grid-item span="s:24 m:8">
        <shadow-card class="h-360px"></shadow-card>
      </n-grid-item>
    </n-grid>
    <n-grid cols="s:2 m:4" responsive="screen" :x-gap="16" :y-gap="16">
      <n-grid-item v-for="i in 4" :key="i">
        <shadow-card class="h-100px"></shadow-card>
      </n-grid-item>
    </n-grid>
    <n-grid :x-gap="16" :y-gap="16" :item-responsive="true" responsive="screen">
      <n-grid-item span="s:24 m:8">
        <shadow-card class="h-360px"></shadow-card>
      </n-grid-item>
      <n-grid-item span="s:24 m:16">
        <shadow-card class="h-360px"></shadow-card>
      </n-grid-item>
    </n-grid>
  </n-space>
</template>

<script lang="ts" setup>
import { NSpace, NGrid, NGridItem } from 'naive-ui';
import { ShadowCard } from '@/components';
// import { NGradientText, NSpace, NButton, NSpin, NTag, NSwitch, NCheckbox, NRadio, useDialog } from 'naive-ui';
</script>
<style scoped></style>
