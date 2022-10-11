<template>
  <router-link :to="routeHomePath" class="flex-center w-full nowrap-hidden">
    <system-logo class="text-32px text-primary" />
    <h2
      v-show="showTitle"
      class="pl-8px text-16px font-bold text-primary transition duration-300 ease-in-out"
      @click="toggleLocal"
    >
      {{ t('message.system.title') }}
    </h2>
  </router-link>
</template>

<script setup lang="ts">
import { routePath } from '@/router';
import { t, setLocale } from '@/locales';

defineOptions({ name: 'GlobalLogo' });

interface Props {
  /** 显示名字 */
  showTitle: boolean;
}

defineProps<Props>();

const routeHomePath = routePath('root');

let flag = true;
function toggleLocal() {
  flag = !flag;
  setLocale(flag ? 'en' : 'zh-CN');
}
</script>

<style scoped></style>
