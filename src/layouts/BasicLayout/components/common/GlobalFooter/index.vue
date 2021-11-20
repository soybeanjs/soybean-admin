<template>
  <n-layout-footer class="bg-white dark:bg-dark">
    <div class="footer-height flex-center">Copyright ©2021 Soybean Admin</div>
  </n-layout-footer>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { NLayoutFooter } from 'naive-ui';
import { useThemeStore } from '@/store';

const theme = useThemeStore();

const footerHeight = computed(() => `${theme.footerStyle.height}px`);
</script>
<style scoped>
.footer-height {
  height: v-bind(footerHeight);
}
</style>
