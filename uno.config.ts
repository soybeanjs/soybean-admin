import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, transformerDirectives, transformerVariantGroup } from 'unocss';
import { presetSoybean } from '@soybeanjs/unocss-preset';
import { presetUi } from '@vean/unocss';

/**
 * `@vean/ui` 的 dist 根目录。
 *
 * 组件样式是编译进 JS 的 class 字符串，而 UnoCSS 只为**扫到的**类名生成工具类；
 * 本仓库消费的是发布产物（不是源码），所以必须把它的 dist 纳入扫描集 ——
 * 否则组件内部的 `bg-popover` / `-translate-y-1/2` / `z-base` 等全部缺失，
 * 组件会渲染成无样式或错位。
 *
 * 用包的入口反推 dist 目录（其 exports 是 `./*` 通配，直接 resolve
 * `package.json` 会落到错误路径）。
 */
const veanUiDist = resolve(dirname(fileURLToPath(import.meta.resolve('@vean/ui'))), '..');

export default defineConfig({
  content: {
    pipeline: {
      /**
       * 扫描过滤器。UnoCSS **始终**用这个列表过滤候选文件（它自己的默认值是
       * `[/\.vue$/]`），所以只写 `.vue` 会让扫描过的 `.js` 被静默丢弃 ——
       * 扫了但什么都没提取到。`.js` 是上面 `@vean/ui` dist 所必需的。
       */
      include: [/\.vue($|\?)/, /\.(js|ts)($|\?)/]
    },
    filesystem: [`${veanUiDist}/**/*.js`]
  },
  presets: [
    // SoybeanJS 通用 shortcuts（`flex-center` / `flex-c` / `flex-1-hidden` …）
    presetSoybean(),
    // Vean 主题 + resetCSS/globalCSS/uiCSS（返回 presetWind3 / animations /
    // scrollbar / webFonts 的整条 preset 栈，故不需要再手动加 presetWind3）
    presetUi({
      resetCSS: true,
      globalCSS: true,
      uiCSS: true
    })
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()]
});
