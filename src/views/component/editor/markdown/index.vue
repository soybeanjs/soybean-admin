<template>
  <div>
    <n-card title="markdown插件" class="shadow-sm rounded-16px">
      <div ref="domRef"></div>
      <template #footer>
        <github-link link="https://github.com/Vanessa219/vditor" />
      </template>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { NCard } from 'naive-ui';
import Vditor from 'vditor';
import 'vditor/src/assets/scss/index.scss';
import { useThemeStore } from '@/store';
import { GithubLink } from '@/components';

const theme = useThemeStore();

const vditor = ref<Vditor | null>(null);
const domRef = ref<HTMLElement | null>(null);

function renderVditor() {
  vditor.value = new Vditor(domRef.value!, {
    minHeight: 400,
    theme: theme.darkMode ? 'dark' : 'classic',
    icon: 'material',
    cache: { enable: false }
  });
}

watch(
  () => theme.darkMode,
  newValue => {
    const themeMode = newValue ? 'dark' : 'classic';
    vditor.value?.setTheme(themeMode);
  }
);

onMounted(() => {
  renderVditor();
});
</script>
<style scoped></style>
