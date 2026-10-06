import { defineConfig } from '@soybeanjs/eslint-config-vue';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

/**
 * Lint 分层：
 *
 * 0. 全局 ignores：codegen / 构建产物（`.ubean/`、`dist/`）不入 lint。
 * 1. 基座 `@soybeanjs/eslint-config-vue`：Vue SFC 的通用风格与最佳实践
 *    （block-order / component-api-style / consistent-type-imports 等）。
 * 2. 追加块（本文件下方两个 config）：把 `vue-sfc-structure` 与
 *    `typescript-functional-style` 两个 skill 中**可机械校验**的规则落成 lint。
 *
 * skill 规则 → lint 映射（docs/v3.md §11.2）：
 * - 禁 `any`                       → `@typescript-eslint/no-explicit-any`（基座是 off，这里改成 error）
 * - 禁 `as T` 断言逃逸（`as const` 豁免）→ `no-restricted-syntax` 的 TSAsExpression selector
 * - script 宏顺序（defineOptions → defineProps → defineEmits → defineSlots）
 *                                  → `vue/define-macros-order`（基座是 off，这里启用）
 * - 模板禁内联箭头函数              → `vue/no-restricted-syntax`（templateBody 专用）
 *
 * 无法机械校验、靠 code review 兜底的约定（见两个 SKILL.md）：
 * script 段 13 步完整顺序、对象/数组/实例句柄优先 `shallowRef`、纯函数短小与
 * early-return、派生态用 `computed` 而非镜像 `ref`、纯逻辑下沉 `src/shared/`。
 */
export default defineConfig(
  {
    // codegen 产物与构建产物不入 lint（含 `.ubean/virtual/*` 的 .ts/.mjs）
    ignores: ['.ubean/**', 'dist/**', 'node_modules/**'],
    overrides: {
      // —— typescript-functional-style：类型精确，禁 any / 断言逃逸 ——
      '@typescript-eslint/no-explicit-any': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: "TSAsExpression[typeAnnotation.type!='TSTypeReference']",
          message: '禁止 as 断言（as never / as unknown / 字面量等）。用类型守卫、satisfies 或修正上游类型。'
        },
        {
          selector: "TSAsExpression[typeAnnotation.type='TSTypeReference']:not([typeAnnotation.typeName.name='const'])",
          message: '禁止 as T 断言逃逸；仅允许 `as const`。用类型守卫、satisfies 或修正上游类型。'
        }
      ],
      // —— vue-sfc-structure：宏声明顺序 ——
      'vue/define-macros-order': [
        'error',
        { order: ['defineOptions', 'defineProps', 'defineEmits', 'defineSlots', 'defineModel'] }
      ],
      // —— vue-sfc-structure：模板禁内联箭头函数（传参调用具名函数不受限） ——
      'vue/no-restricted-syntax': [
        'error',
        {
          selector: 'VElement > VStartTag VAttribute[directive=true] VExpressionContainer ArrowFunctionExpression',
          message: '模板内禁止内联箭头函数；把逻辑放到 <script setup> 的具名函数。'
        }
      ]
    }
  },
  {
    // 基座只管 `**/*.vue`；`.ts` 需要独立块（`src/**`、`*.config.ts`、测试）。
    // 本块自己的 ignores：防止 lint 到 `.ubean/` 里的 .d.ts/.ts codegen 产物
    // （它们头部的 eslint-disable 会被报 unused directive）。
    files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
    ignores: ['.ubean/**', 'dist/**'],
    languageOptions: { parser: tsParser },
    plugins: { '@typescript-eslint': tsPlugin },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: "TSAsExpression[typeAnnotation.type!='TSTypeReference']",
          message: '禁止 as 断言（as never / as unknown / 字面量等）。用类型守卫、satisfies 或修正上游类型。'
        },
        {
          selector: "TSAsExpression[typeAnnotation.type='TSTypeReference']:not([typeAnnotation.typeName.name='const'])",
          message: '禁止 as T 断言逃逸；仅允许 `as const`。用类型守卫、satisfies 或修正上游类型。'
        }
      ]
    }
  }
);
