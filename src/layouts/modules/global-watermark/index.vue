<script setup lang="ts">
defineOptions({
  name: 'GlobalWatermark'
});

interface Props {
  text?: App.Global.WatermarkProps['text'];
}

defineProps<Props>();
</script>

<template>
  <NWatermark
    :content="text"
    cross
    fullscreen
    :font-size="16"
    :line-height="16"
    :width="384"
    :height="384"
    :x-offset="12"
    :y-offset="60"
    :rotate="-15"
    :z-index="9999"
    class="pointer-events-none"
  />
</template>

<style scoped></style>
