<template>
  <web-site-link label="github地址：" :link="link" />
</template>

<script setup lang="ts">
import WebSiteLink from './WebSiteLink.vue';

interface Props {
  /** github链接 */
  link: string;
}

defineProps<Props>();
</script>
<style scoped></style>
