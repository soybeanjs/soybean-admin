<script setup lang="ts">
import { getRgbOfColor } from '@sa/utils';
import { $t } from '@/locales';
import { localStg } from '@/utils/storage';

const loadingClasses = [
  'left-0 top-0',
  'left-0 bottom-0 animate-delay-500',
  'right-0 top-0 animate-delay-1000',
  'right-0 bottom-0 animate-delay-1500'
];

function addThemeColorCssVars() {
  const themeColor = localStg.get('themeColor') || '#646cff';

  const { r, g, b } = getRgbOfColor(themeColor);

  const cssVars = `--primary-color: ${r} ${g} ${b}`;
  document.documentElement.style.cssText = cssVars;
}

addThemeColorCssVars();
</script>

<template>
  <div class="fixed-center flex-col">
    <SystemLogo class="text-128px text-primary" />
    <div class="w-56px h-56px my-36px">
      <div class="relative h-full animate-spin">
        <div
          v-for="(item, index) in loadingClasses"
          :key="index"
          class="absolute w-16px h-16px bg-primary rounded-8px animate-pulse"
          :class="item"
        ></div>
      </div>
    </div>
    <h2 class="text-28px font-500 text-#646464">{{ $t('system.title') }}</h2>
  </div>
</template>

<style scoped></style>
