<template>
  <n-back-top :show="show" class="z-1000" />
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useWindowScroll } from '@vueuse/core';

defineOptions({ name: 'GlobalBackTop' });

const { y: scrollY } = useWindowScroll();

const show = computed(() => scrollY.value > 180);
</script>
<style scoped></style>
