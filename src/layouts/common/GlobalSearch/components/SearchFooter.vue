<template>
  <div class="px-24px h-44px flex-y-center">
    <span class="mr-14px flex-y-center">
      <icon-mdi-keyboard-return class="icon text-20px p-2px mr-6px" />
      <span>确认</span>
    </span>
    <span class="mr-14px flex-y-center">
      <icon-mdi-arrow-up-thin class="icon text-20px p-2px mr-5px" />
      <icon-mdi-arrow-down-thin class="icon text-20px p-2px mr-6px" />
      <span>切换</span>
    </span>
    <span class="flex-y-center">
      <icon-mdi-keyboard-esc class="icon text-20px p-2px mr-6px" />
      <span>关闭</span>
    </span>
  </div>
</template>

<script lang="ts" setup>
defineOptions({ name: 'SearchFooter' });
</script>

<style lang="scss" scoped>
.icon {
  box-shadow: inset 0 -2px #cdcde6, inset 0 0 1px 1px #fff, 0 1px 2px 1px #1e235a66;
}
</style>
