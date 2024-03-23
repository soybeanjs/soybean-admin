<script setup lang="ts">
import { $t } from '@/locales';

defineOptions({
  name: 'LookForward'
});
</script>

<template>
  <div class="size-full min-h-520px flex-col-center gap-24px overflow-hidden">
    <div class="flex text-400px text-primary">
      <SvgIcon local-icon="expectation" />
    </div>
    <slot>
      <h3 class="text-28px text-primary font-500">{{ $t('common.lookForward') }}</h3>
    </slot>
  </div>
</template>

<style scoped></style>
