<template>
  <div></div>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';

const { query } = useRoute();
const router = useRouter();

function init() {
  const redirect = (query.redirectUrl as string) || '/';
  router.replace(redirect);
}

init();
</script>
<style scoped></style>
