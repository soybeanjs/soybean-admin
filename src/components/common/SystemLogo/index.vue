<template>
  <img :src="logoSrc" alt="" />
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import logo from '@/assets/img/common/logo.png';
import logoFill from '@/assets/img/common/logo-fill.png';

const props = defineProps({
  fill: {
    type: Boolean,
    default: false
  }
});

const logoSrc = computed(() => (props.fill ? logoFill : logo));
</script>
<style scoped></style>
