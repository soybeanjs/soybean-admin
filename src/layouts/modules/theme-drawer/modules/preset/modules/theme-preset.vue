<script setup lang="ts">
import { computed } from 'vue';
import { defu } from 'defu';
import { useThemeStore } from '@/store/modules/theme';
import { themeSettings } from '@/theme/settings';
import { $t } from '@/locales';

defineOptions({
  name: 'ThemePreset'
});

type ThemePreset = Pick<
  App.Theme.ThemeSetting,
  | 'themeScheme'
  | 'grayscale'
  | 'colourWeakness'
  | 'recommendColor'
  | 'themeColor'
  | 'themeRadius'
  | 'otherColor'
  | 'isInfoFollowPrimary'
  | 'layout'
  | 'page'
  | 'header'
  | 'tab'
  | 'fixedHeaderAndTab'
  | 'sider'
  | 'footer'
  | 'watermark'
  | 'tokens'
> & {
  name: string;
  desc: string;
  i18nkey?: string;
  version: string;
  /** Optional NaiveUI theme overrides */
  naiveui?: App.Theme.NaiveUIThemeOverride;
};

const presetModules = import.meta.glob('@/theme/preset/*.json', { eager: true, import: 'default' });

const themeStore = useThemeStore();

// Extract preset data
const presets = computed(() =>
  Object.entries(presetModules)
    .map(([path, presetData]) => {
      const fileName = path.split('/').pop()?.replace('.json', '') || '';
      return {
        id: fileName,
        ...(presetData as ThemePreset)
      };
    })
    .sort((a, b) => {
      if (a.name === 'default') return -1;
      if (b.name === 'default') return 1;
      return a.name.localeCompare(b.name);
    })
);

const getPresetName = (preset: ThemePreset): string => {
  if (!preset.i18nkey) return preset.name;
  try {
    const key = `${preset.i18nkey}.name` as App.I18n.I18nKey;
    const translated = $t(key);
    return translated !== key ? translated : preset.name;
  } catch {
    return preset.name;
  }
};

const getPresetDesc = (preset: ThemePreset): string => {
  if (!preset.i18nkey) return preset.desc;
  try {
    const key = `${preset.i18nkey}.desc` as App.I18n.I18nKey;
    const translated = $t(key);
    return translated !== key ? translated : preset.desc;
  } catch {
    return preset.desc;
  }
};

const applyPreset = (preset: ThemePreset): void => {
  const mergedPreset = defu(preset, themeSettings);
  const { themeScheme, grayscale, colourWeakness, layout, watermark, naiveui, ...rest } = mergedPreset;
  themeStore.setThemeScheme(themeScheme);
  themeStore.setGrayscale(grayscale);
  themeStore.setColourWeakness(colourWeakness);
  themeStore.setThemeLayout(layout.mode);
  themeStore.setWatermarkEnableUserName(watermark.enableUserName);
  themeStore.setWatermarkEnableTime(watermark.enableTime);

  Object.assign(themeStore, {
    ...rest,
    layout: { ...themeStore.layout, scrollMode: layout.scrollMode },
    page: { ...rest.page },
    header: { ...rest.header },
    tab: { ...rest.tab },
    sider: { ...rest.sider },
    footer: { ...rest.footer },
    watermark: { ...watermark },
    tokens: { ...rest.tokens }
  });

  // Apply NaiveUI theme overrides if present
  themeStore.setNaiveThemeOverrides(naiveui);

  window.$message?.success($t('theme.appearance.preset.applySuccess'));
};
</script>

<template>
  <NDivider>{{ $t('theme.appearance.preset.title') }}</NDivider>

  <div class="flex flex-col gap-3">
    <div
      v-for="preset in presets"
      :key="preset.id"
      class="border border-primary/10 rounded-lg border-solid bg-white/5 p-3 backdrop-blur-10 transition-all duration-300 hover:(shadow-md -translate-y-0.5)"
    >
      <div class="mb-2 flex items-center justify-between">
        <div class="min-w-0 w-full flex flex-1 items-center justify-between gap-2">
          <h5 class="m-0 truncate text-sm text-primary font-600">
            {{ getPresetName(preset) }}
          </h5>
          <NBadge :value="`v${preset.version}`" type="info" size="small" class="flex-shrink-0 opacity-80" />
        </div>
        <NButton type="primary" size="tiny" ghost round class="ml-2 flex-shrink-0" @click="applyPreset(preset)">
          {{ $t('theme.appearance.preset.apply') }}
        </NButton>
      </div>

      <p class="line-clamp-2 mb-3 text-xs text-gray-500 leading-4">{{ getPresetDesc(preset) }}</p>

      <div class="flex items-center justify-between">
        <div class="flex gap-1">
          <div
            v-for="(color, key) in { primary: preset.themeColor, ...preset.otherColor }"
            :key="key"
            class="h-3 w-3 cursor-pointer border border-white/30 rounded-full transition-transform hover:scale-110"
            :style="{ backgroundColor: color }"
            :class="{ 'ring-1 ring-primary/50': key === 'primary' }"
            :title="key"
          />
        </div>
        <div class="flex items-center gap-1">
          <div class="text-lg">
            {{ preset.themeScheme === 'dark' ? '🌙' : '☀️' }}
          </div>
          <div class="text-lg">
            {{ preset.grayscale ? '🎨' : '' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
