<script setup lang="ts">
import { $t } from '@/locales';

defineOptions({
  name: 'CreativityBanner'
});
</script>

<template>
  <NCard :title="$t('page.home.creativity')" :bordered="false" size="small" class="card-wrapper h-full">
    <div class="flex-center h-full">
      <IconLocalBanner class="text-400px sm:text-320px text-primary" />
    </div>
  </NCard>
</template>

<style scoped></style>
