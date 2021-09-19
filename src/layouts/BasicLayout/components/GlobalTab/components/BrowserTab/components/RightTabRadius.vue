<template>
  <div class="absolute bottom-0 -right-16px flex w-32px h-full bg-white">
    <div
      class="relative w-1/2 h-full transition-background duration-400 ease-in-out"
      :class="{ 'bg-black bg-opacity-10': isRightHover }"
    >
      <div class="absolute-lt w-full h-full bg-white rounded-tr-8px overflow-hidden z-2">
        <div
          class="w-full h-full transition-background duration-400 ease-in-out bg-opacity-10"
          :class="{ 'bg-primary': isPrimary, 'bg-black': isHover && !isPrimary }"
        ></div>
      </div>
    </div>
    <div class="relative w-1/2 h-full">
      <div class="absolute-lt w-full h-full bg-white rounded-bl-8px overflow-hidden z-2">
        <div
          class="w-full h-full transition-background duration-400 ease-in-out bg-opacity-10"
          :class="[isRightHover ? 'bg-black' : 'bg-white']"
        ></div>
      </div>
      <div
        class="absolute-lt w-full h-full transition-background duration-400 ease-in-out bg-opacity-10 z-1"
        :class="{ 'bg-primary': isPrimary, 'bg-black': isHover && !isPrimary }"
      ></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  isPrimary: {
    type: Boolean,
    default: false
  },
  isHover: {
    type: Boolean,
    default: false
  },
  isRightHover: {
    type: Boolean,
    default: false
  }
});
</script>
<style scoped></style>
