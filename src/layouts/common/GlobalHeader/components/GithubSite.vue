<template>
  <hover-container
    tooltip-content="github"
    class="w-40px h-full"
    content-class="hover:text-primary"
    @click="handleClickLink"
  >
    <icon-mdi-github class="text-20px" />
  </hover-container>
</template>

<script lang="ts" setup>
function handleClickLink() {
  window.open('https://github.com/honghuangdc/soybean-admin', '_blank');
}
</script>
<style scoped></style>
