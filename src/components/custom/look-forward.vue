<script setup lang="ts">
import { $t } from '@/locales';

defineOptions({
  name: 'LookForward'
});
</script>

<template>
  <div class="flex-vertical-center gap-24px min-h-520px wh-full overflow-hidden">
    <div class="flex text-400px text-primary">
      <SvgIcon local-icon="expectation" />
    </div>
    <h3 class="text-28px font-500 text-primary">{{ $t('common.lookForward') }}</h3>
  </div>
</template>

<style scoped></style>
