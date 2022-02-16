<template>
  <div class="flex-col-center wh-full">
    <div class="w-400px h-400px text-primary">
      <component :is="active" />
    </div>
    <router-link :to="{ name: routeHomePath }">
      <n-button type="primary">回到首页</n-button>
    </router-link>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { Component } from 'vue';
import { SvgNoPermission, SvgNotFound, SvgServiceError } from '@/components';
import { routeName } from '@/router';

type ExceptionType = '403' | '404' | '500';

interface Props {
  /** 异常类型 403 404 500 */
  type: ExceptionType;
}

type ExceptionComponent = Record<ExceptionType, Component>;

const props = defineProps<Props>();

const routeHomePath = routeName('root');

const exceptions: ExceptionComponent = {
  '403': SvgNoPermission,
  '404': SvgNotFound,
  '500': SvgServiceError
};

const active = computed(() => exceptions[props.type]);
</script>
<style scoped></style>
