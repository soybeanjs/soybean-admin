<script setup lang="ts">
import { useId } from 'vue';

/**
 * 登录页背景装饰（对照 soybean-unify 的 `components/wave-bg.vue`）。
 *
 * 三层叠加：主色渐变底 → 两枚大色块（unify 的 SVG 曲线）→ 柔光晕。
 *
 * 与 unify 的关键差异：unify 的色块取 `hsl(var(--primary-200/300/500))`，
 * 但 `@vean/theme` 只定义**单个** `primary` 角色，没有 200/300/500 色阶
 * （`resolveThemeMap()` 返回的 token 只有 `{kind:'palette', palette, level}`，
 * `--primary-200` 无人声明）。所以这里改用 `hsl(var(--primary) / <alpha>)`：
 * 同一套变量在 `.dark` 下由 `SConfigProvider` 重新声明，明暗自动跟随。
 *
 * `pointer-events-none` + `aria-hidden`：装饰层不参与命中与朗读。
 */
defineOptions({ name: 'WaveBg' });

const uid = useId();
const topPathId = `wave-bg-top-path-${uid}`;
const topGradientId = `wave-bg-top-gradient-${uid}`;
const bottomPathId = `wave-bg-bottom-path-${uid}`;
const bottomGradientId = `wave-bg-bottom-gradient-${uid}`;

/** 右上角大色块（1337×1337，几何取自 unify） */
const TOP_PATH =
  'M1337,668.5 C1337,1037.455193874239 1037.455193874239,1337 668.5,1337 C523.6725684305388,1337 337,1236 370.50000000000006,1094 C434.03835568300906,824.6732385973953 6.906089672974592e-14,892.6277623047779 0,668.5000000000001 C0,299.5448061257611 299.5448061257609,1.1368683772161603e-13 668.4999999999999,0 C1037.455193874239,0 1337,299.544806125761 1337,668.5Z';

/** 左下角大色块（967×896，几何取自 unify） */
const BOTTOM_PATH =
  'M896,448 C1142.6325445712241,465.5747656464056 695.2579309733121,896 448,896 C200.74206902668806,896 5.684341886080802e-14,695.2579309733121 0,448.0000000000001 C0,200.74206902668806 200.74206902668791,5.684341886080802e-14 447.99999999999994,0 C695.2579309733121,0 475,418 896,448Z';
</script>

<template>
  <div class="pointer-events-none absolute inset-0 z-1 overflow-hidden" aria-hidden="true">
    <!-- 主色渐变底：跟随 `--primary`，切主题/明暗自动变色 -->
    <div class="absolute inset-0 bg-gradient-to-br from-primary/6 via-background to-primary/4" />

    <!-- 右上大色块 -->
    <div class="absolute -right-75 -top-225 lt-sm:(-right-25 -top-293)">
      <svg height="1337" width="1337" fill="none">
        <defs>
          <linearGradient :id="topGradientId" x1="0.79" y1="0.62" x2="0.21" y2="0.86">
            <stop offset="0" style="stop-color: hsl(var(--primary) / 0.07)" />
            <stop offset="1" style="stop-color: hsl(var(--primary) / 0.22)" />
          </linearGradient>
        </defs>
        <path :id="topPathId" fill-rule="evenodd" :d="TOP_PATH" :fill="`url(#${topGradientId})`" />
      </svg>
    </div>

    <!-- 左下大色块 -->
    <div class="absolute -bottom-100 -left-50 lt-sm:(-bottom-190 -left-25)">
      <svg height="896" width="967.8852157128662" fill="none">
        <defs>
          <linearGradient :id="bottomGradientId" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0" style="stop-color: hsl(var(--primary) / 0.22)" />
            <stop offset="1" style="stop-color: hsl(var(--primary) / 0.07)" />
          </linearGradient>
        </defs>
        <path :id="bottomPathId" fill-rule="evenodd" :d="BOTTOM_PATH" :fill="`url(#${bottomGradientId})`" />
      </svg>
    </div>
  </div>
</template>
