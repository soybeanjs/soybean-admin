<template>
  <div class="flex-col-center wh-full">
    <div class="w-400px h-400px text-primary">
      <svg-no-permission v-if="type === '403'" />
      <svg-not-found v-if="type === '404'" />
      <svg-service-error v-if="type === '500'" />
    </div>
    <router-link :to="ROUTE_HOME.path">
      <n-button type="primary">回到首页</n-button>
    </router-link>
  </div>
</template>

<script lang="ts" setup>
import { NButton } from 'naive-ui';
import { SvgNoPermission, SvgNotFound, SvgServiceError } from '@/components';
import { ROUTE_HOME } from '@/router';

interface Props {
  /** 异常类型 */
  type: '403' | '404' | '500';
}

defineProps<Props>();
</script>
<style scoped></style>
