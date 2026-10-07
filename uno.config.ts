import { defineConfig, transformerDirectives, transformerVariantGroup } from 'unocss';
import { presetSoybean } from '@soybeanjs/unocss-preset';
import { presetUi } from '@vean/unocss';

export default defineConfig({
  content: {
    pipeline: {
      include: [/\.(vue|[jt]sx)($|\?)/]
    }
  },
  presets: [presetSoybean(), presetUi()],
  transformers: [transformerDirectives(), transformerVariantGroup()]
});
