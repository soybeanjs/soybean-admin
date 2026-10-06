import { defineConfig, transformerDirectives, transformerVariantGroup } from 'unocss';
import { presetSoybean } from '@soybeanjs/unocss-preset';
import { presetUi } from '@vean/unocss';

/**
 * 应用样式管线（UnoCSS 只负责「应用自己写的原子类」）。
 *
 * 三份样式的职责边界（同一份规则绝不能生成两次）：
 *
 * 1. **Vean 组件自身样式**（含组件内部工具类 `bg-popover` / `-translate-y-1/2`
 *    / `z-base` …）已预构建在 `@vean/ui/styles.css` 里。它由
 *    `ubean.config.ts` 的 `ui`（registry 注入）或 `src/app.ts` 的显式
 *    `import '@vean/ui/styles.css'` 进入产物 —— **不是** UnoCSS 生成的。
 * 2. **应用自己写的类**（`src/**`）由本配置按需生成。
 * 3. **主题 token**（`:root` / `.dark` 的 CSS 变量）由 `@vean/theme` 在运行时
 *    经 `SConfigProvider` 注入，既不在 styles.css 也不在这里。
 */
export default defineConfig({
  content: {
    pipeline: {
      /**
       * 扫描过滤器。UnoCSS **始终**用这个列表过滤候选文件（其内建默认值是
       * `[/\.vue$/]`），未列出的后缀即使被扫到也会被静默丢弃 ——
       * 所以 `.js` / `.ts` 必须显式列出。
       */
      include: [/\.vue($|\?)/, /\.(js|ts)($|\?)/],
      /**
       * 必须排除 `node_modules`。UnoCSS 默认会扫依赖目录，于是
       * `@vean/ui/dist` 里每个候选类名都会被重新生成为全局规则 ——
       * 实测（`ubean build`，未改此配置）产物 CSS 177.66 kB / gzip 23.32 kB，
       * 加 `exclude: [/node_modules/]` 后 **4.21 kB / gzip 1.15 kB**：
       * 那 ~173 kB 全部是组件库已预构建样式的重复生成。
       *
       * 排除之后，组件库样式只来自 `@vean/ui/styles.css`（见文件头第 1 条）。
       */
      exclude: [/node_modules/]
    }
  },
  presets: [
    // SoybeanJS 通用 shortcuts（`flex-center` / `flex-c` / `flex-1-hidden` …）
    presetSoybean(),
    // Vean 预设：theme 变量 + wind3/animations/scrollbar/webFonts 整条栈。
    // `resetCSS` / `globalCSS` / `uiCSS` 一律关闭 —— reset 与「ui 组件样式」
    // 都改由 `@vean/ui/styles.css` 承担，本 preset 只负责按需生成应用用到的原子类。
    presetUi({
      resetCSS: false,
      globalCSS: false,
      uiCSS: false
    })
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()]
});
