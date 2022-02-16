<template>
  <div class="h-full">
    <n-card title="markdown插件" class="shadow-sm rounded-16px">
      <div ref="domRef"></div>
      <template #footer>
        <github-link link="https://github.com/Vanessa219/vditor" />
      </template>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import Vditor from 'vditor';
import 'vditor/src/assets/scss/index.scss';
import { GithubLink } from '@/components';
import { useThemeStore } from '@/store';

const theme = useThemeStore();

const vditor = ref<Vditor>();
const domRef = ref<HTMLElement>();

function renderVditor() {
  vditor.value = new Vditor(domRef.value!, {
    minHeight: 400,
    theme: theme.darkMode ? 'dark' : 'classic',
    icon: 'material',
    cache: { enable: false }
  });
}

const stopHandle = watch(
  () => theme.darkMode,
  newValue => {
    const themeMode = newValue ? 'dark' : 'classic';
    vditor.value?.setTheme(themeMode);
  }
);

onMounted(() => {
  renderVditor();
});

onUnmounted(() => {
  stopHandle();
});
</script>
<style scoped></style>
