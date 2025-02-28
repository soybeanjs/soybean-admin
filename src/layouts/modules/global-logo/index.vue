<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import { $t } from '@/locales';

defineOptions({
  name: 'GlobalLogo'
});

interface Props {
  /** Whether to show the title */
  showTitle?: boolean;
}

const route = useRoute();
const title = computed(() => {
  return route.meta.pageType === 'pan' ? $t('system.panTitle') : $t('system.title');
});

withDefaults(defineProps<Props>(), {
  showTitle: true
});
</script>

<template>
  <RouterLink to="/" class="w-full flex-center nowrap-hidden">
    <SystemLogo class="text-32px text-primary" />
    <h2 v-show="showTitle" class="pl-8px text-16px text-primary font-bold transition duration-300 ease-in-out">
      {{ title }}
    </h2>
  </RouterLink>
</template>

<style scoped></style>
