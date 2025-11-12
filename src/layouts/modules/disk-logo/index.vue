<script lang="ts" setup>
defineOptions({
  name: 'DiskLogo'
});

interface Props {
  /** Whether to show the title */
  showTitle?: boolean;
}

withDefaults(defineProps<Props>(), {
  showTitle: true
});
</script>

<template>
  <RouterLink to="/disk" class="w-full flex-center nowrap-hidden">
    <SystemLogo class="text-32px text-primary" />
    <h2 v-show="showTitle" class="pl-8px text-16px text-primary font-bold transition duration-300 ease-in-out">
      {{ $t('disk.title') }}
    </h2>
  </RouterLink>
</template>
