<script setup lang="ts">
import { computed } from 'vue';
import { useBreakpoints } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import { mobileViewportMaxWidth } from '@vean/aria/shared';
import type { LayoutCollapsible, LayoutVariant } from '@vean/ui';
import { useAppStore } from '@/store/modules/app';
import { useThemeStore } from '@/store/modules/theme';
import type { LayoutModeName } from '@/store/modules/theme';
import {
  LAYOUT_MODE_CANVAS_CLASS,
  LAYOUT_MODE_CARD_CLASS,
  LAYOUT_MODE_DIAGRAMS,
  THEME_ROW_CLASS,
  THEME_SECTION_TITLE_CLASS,
  useSelectField
} from './shared';
import type { ThemeOptionItem } from './shared';
import OptionRow from './option-row.vue';
import StepperRow from './stepper-row.vue';
import SwitchRow from './switch-row.vue';

defineOptions({ name: 'ThemeLayoutPanel' });

const { t } = useI18n();

const themeStore = useThemeStore();
const appStore = useAppStore();

/** 与 app store 的移动端降级同一判据（767.9px），窄屏时禁用不可用模式 */
const breakpoints = useBreakpoints({ mobile: mobileViewportMaxWidth });
const isNarrow = breakpoints.smaller('mobile');

const variantItems = computed<ThemeOptionItem[]>(() => [
  { value: 'sidebar', label: t('theme.variant.sidebar') },
  { value: 'floating', label: t('theme.variant.floating') },
  { value: 'inset', label: t('theme.variant.inset') }
]);

const collapsibleItems = computed<ThemeOptionItem[]>(() => [
  { value: 'icon', label: t('theme.collapsible.icon') },
  { value: 'offcanvas', label: t('theme.collapsible.offcanvas') }
]);

const layoutVariant = useSelectField<LayoutVariant>({
  get: () => themeStore.settings.variant,
  items: ['sidebar', 'floating', 'inset'],
  fallback: 'sidebar',
  patch: value => ({ variant: value })
});

const layoutCollapsible = useSelectField<LayoutCollapsible>({
  get: () => themeStore.settings.collapsible,
  items: ['icon', 'offcanvas'],
  fallback: 'icon',
  patch: value => ({ collapsible: value })
});

const isVertical = computed(() => themeStore.settings.layoutMode === 'vertical');

/** 窄栏宽度只在「图标折叠」下有意义（offcanvas 折叠时侧栏整体滑出，没有窄栏） */
const showCollapsedWidth = computed(() => isVertical.value && themeStore.settings.collapsible === 'icon');

function onSelectLayoutMode(value: LayoutModeName) {
  if (isNarrow.value) return;
  themeStore.setThemeSettings({ layoutMode: value });
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <span :class="THEME_SECTION_TITLE_CLASS">{{ t('theme.layoutMode.title') }}</span>
      <div class="grid grid-cols-3 gap-2">
        <button
          v-for="item in LAYOUT_MODE_DIAGRAMS"
          :key="item.value"
          type="button"
          :disabled="isNarrow"
          :class="[
            LAYOUT_MODE_CARD_CLASS,
            themeStore.settings.layoutMode === item.value ? 'border-primary' : 'border-transparent',
            isNarrow ? 'cursor-not-allowed opacity-50' : ''
          ]"
          @click="onSelectLayoutMode(item.value)"
        >
          <span :class="LAYOUT_MODE_CANVAS_CLASS">
            <span v-for="box in item.boxes" :key="box" :class="box" />
          </span>
          <span class="truncate text-xs">{{ t(item.label) }}</span>
        </button>
      </div>
      <p v-if="isNarrow" class="text-xs text-muted-foreground">{{ t('theme.layoutMode.mobileDisabled') }}</p>
    </div>

    <OptionRow v-model="layoutVariant" :label="t('theme.variant.title')" :items="variantItems" />
    <OptionRow
      v-if="!isVertical"
      v-model="layoutCollapsible"
      :label="t('theme.collapsible.title')"
      :items="collapsibleItems"
    />

    <StepperRow
      v-model="themeStore.settings.sidebarWidth"
      :label="t('theme.siderWidth')"
      :min="120"
      :max="400"
      :step="10"
      unit="px"
    />
    <StepperRow
      v-if="showCollapsedWidth"
      v-model="themeStore.settings.collapsedSidebarWidth"
      :label="t('theme.siderCollapsedWidth')"
      :min="32"
      :max="120"
      :step="2"
      unit="px"
    />
    <StepperRow
      v-model="themeStore.settings.mobileSidebarWidth"
      :label="t('theme.mobileSiderWidth')"
      :min="180"
      :max="320"
      :step="10"
      unit="px"
    />

    <div class="flex flex-col gap-1">
      <span :class="THEME_SECTION_TITLE_CLASS">{{ t('theme.header') }}</span>
      <StepperRow
        v-model="themeStore.settings.headerHeight"
        :label="t('theme.headerHeight')"
        :min="48"
        :max="120"
        :step="4"
        unit="px"
      />
      <SwitchRow v-model="themeStore.settings.headerVisible" :label="t('theme.headerVisible')" />
      <SwitchRow v-model="themeStore.settings.fixedHeaderAndTab" :label="t('theme.fixedHeaderAndTab')" />
    </div>

    <div class="flex flex-col gap-1">
      <span :class="THEME_SECTION_TITLE_CLASS">{{ t('theme.tab.title') }}</span>
      <StepperRow
        v-model="themeStore.settings.tabHeight"
        :label="t('theme.tabHeight')"
        :min="32"
        :max="64"
        :step="2"
        unit="px"
      />
      <SwitchRow v-model="themeStore.settings.tabVisible" :label="t('theme.tabVisible')" />
    </div>

    <div class="flex flex-col gap-1">
      <span :class="THEME_SECTION_TITLE_CLASS">{{ t('theme.footer.title') }}</span>
      <StepperRow
        v-model="themeStore.settings.footerHeight"
        :label="t('theme.footerHeight')"
        :min="32"
        :max="96"
        :step="4"
        unit="px"
      />
      <SwitchRow v-model="themeStore.settings.footerVisible" :label="t('theme.footerVisible')" />
      <SwitchRow
        v-model="themeStore.settings.fixedFooter"
        :label="t('theme.fixedFooter')"
        :disabled="!themeStore.settings.footerVisible"
      />
      <SwitchRow v-model="themeStore.settings.stretchFooter" :label="t('theme.stretchFooter')" />
    </div>

    <SwitchRow v-model="themeStore.settings.fullContent" :label="t('theme.fullContent')" />

    <div :class="THEME_ROW_CLASS">
      <span class="text-sm">{{ t('theme.sider') }}</span>
      <button
        type="button"
        class="rounded-md border border-border px-3 py-1 text-xs transition-colors hover:border-primary"
        @click="appStore.toggleSidebar()"
      >
        {{ appStore.sidebarOpen ? t('theme.collapse') : t('theme.expand') }}
      </button>
    </div>
  </div>
</template>
