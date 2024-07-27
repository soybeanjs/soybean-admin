<script setup lang="ts">
import { computed, nextTick } from 'vue';
import type { PopoverPlacement } from 'naive-ui';
import { $t } from '@/locales';
import { useThemeStore } from '@/store/modules/theme';

defineOptions({ name: 'ThemeSchemaSwitch' });

interface Props {
  /** Show tooltip */
  showTooltip?: boolean;
  /** Tooltip placement */
  tooltipPlacement?: PopoverPlacement;
}

const props = withDefaults(defineProps<Props>(), {
  showTooltip: true,
  tooltipPlacement: 'bottom'
});

const themeStore = useThemeStore();

const icons: Record<UnionKey.ThemeScheme, string> = {
  light: 'material-symbols:sunny',
  dark: 'material-symbols:nightlight-rounded',
  auto: 'material-symbols:hdr-auto'
};

const icon = computed(() => icons[themeStore.themeScheme]);

const tooltipContent = computed(() => {
  if (!props.showTooltip) return '';

  return $t('icon.themeSchema');
});

function toggleDark(event: MouseEvent) {
  const isAppearanceTransition =
    document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!isAppearanceTransition) {
    themeStore.toggleThemeScheme();
    return;
  }

  const x = event.clientX;
  const y = event.clientY;
  const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  // @ts-expect-error: Transition API
  const transition = document.startViewTransition(async () => {
    themeStore.toggleThemeScheme();
    await nextTick();
  });

  transition.ready.then(() => {
    const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`];
    document.documentElement.animate(
      {
        clipPath: themeStore.darkMode ? [...clipPath].reverse() : clipPath
      },
      {
        duration: 400,
        easing: 'ease-out',
        pseudoElement: themeStore.darkMode ? '::view-transition-old(root)' : '::view-transition-new(root)'
      }
    );
  });
}
</script>

<template>
  <ButtonIcon
    :icon="icon"
    :tooltip-content="tooltipContent"
    :tooltip-placement="tooltipPlacement"
    @click="toggleDark"
  />
</template>

<style scoped></style>
