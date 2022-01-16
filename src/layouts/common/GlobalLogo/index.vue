<template>
  <router-link :to="routeHomePath" class="flex-center w-full nowrap-hidden">
    <system-logo class="w-32px h-32px text-primary" />
    <h2 v-show="showTitle" class="pl-8px text-16px font-bold text-primary transition duration-300 ease-in-out">
      {{ title }}
    </h2>
  </router-link>
</template>

<script setup lang="ts">
import { SystemLogo } from '@/components';
import { routePath } from '@/router';
import { useAppInfo } from '@/composables';

interface Props {
  /** 显示名字 */
  showTitle: boolean;
}

defineProps<Props>();

const { title } = useAppInfo();
const routeHomePath = routePath('root');
</script>
<style scoped></style>
