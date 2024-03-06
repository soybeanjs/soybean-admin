<script lang="ts" setup>
import { $t } from '@/locales';

defineOptions({ name: 'SearchFooter' });
</script>

<template>
  <div class="h-44px flex-y-center px-24px">
    <span class="mr-14px flex-y-center">
      <icon-mdi-keyboard-return class="icon mr-6px p-2px text-20px" />
      <span>{{ $t('common.confirm') }}</span>
    </span>
    <span class="mr-14px flex-y-center">
      <icon-mdi-arrow-up-thin class="icon mr-5px p-2px text-20px" />
      <icon-mdi-arrow-down-thin class="icon mr-6px p-2px text-20px" />
      <span>{{ $t('common.switch') }}</span>
    </span>
    <span class="flex-y-center">
      <icon-mdi-keyboard-esc class="icon mr-6px p-2px text-20px" />
      <span>{{ $t('common.close') }}</span>
    </span>
  </div>
</template>

<style lang="scss" scoped>
.icon {
  box-shadow:
    inset 0 -2px #cdcde6,
    inset 0 0 1px 1px #fff,
    0 1px 2px 1px #1e235a66;
}
</style>
