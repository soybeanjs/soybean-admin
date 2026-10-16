<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { SThemeModeSegment } from '@vean/ui';
import { APP_TITLE } from '@/constants';
import loginIllustration from '@/assets/login/bg.png';
import type { LoginLayoutProps } from '../shared';
import LoginLayoutSwitcher from './layout-switcher.vue';

/**
 * 登录壳：左右分栏（迁移自 koi-ui `src/views/login/index.vue` 的 el-row 外观）。
 *
 * 左栏品牌插画 + 标语，上面压一层毛玻璃（koi 的 `.glass-overlay`）；
 * 右栏 logo + 标题 + 表单。窄屏隐藏左栏、右栏铺满（koi 的 `:xs="0"`）。
 */
defineOptions({ name: 'LoginLayoutSplit' });

defineProps<LoginLayoutProps>();

const { t } = useI18n();
</script>

<template>
  <div class="flex size-full overflow-hidden bg-gray-50 dark:bg-neutral-950">
    <!-- 左栏：品牌插画 + 毛玻璃，窄屏隐藏 -->
    <div class="relative flex max-md:hidden items-center justify-center overflow-hidden md:flex-1 lg:flex-[2]">
      <div class="login-brand-surface absolute inset-0" />
      <div class="login-brand-glass absolute inset-0" />

      <div class="relative z-2 flex flex-col items-center gap-6 px-8 text-center select-none">
        <img :src="loginIllustration" :alt="APP_TITLE" class="login-brand-float h-80 w-90 max-w-full object-contain" />
        <div class="flex flex-col gap-2">
          <p class="text-xl text-primary">{{ t('login.brandSlogan') }} · {{ APP_TITLE }}</p>
          <p class="text-base text-muted-foreground">{{ t('login.brandDescription') }}</p>
        </div>
      </div>
    </div>

    <!-- 右栏：表单 -->
    <div class="relative flex flex-1 flex-col items-center justify-center px-6 py-10">
      <div class="absolute top-4 right-4 z-10 flex items-center gap-2">
        <LoginLayoutSwitcher />
        <SThemeModeSegment size="sm" />
      </div>

      <div class="flex w-full max-w-80 flex-col items-stretch">
        <div class="flex items-center gap-2">
          <AppLogo class="size-9" />
          <span class="text-xl font-500">{{ APP_TITLE }}</span>
        </div>

        <div class="my-4.5 flex items-center gap-3 text-sm text-muted-foreground">
          <span class="h-1px flex-1 bg-border" />
          <span>{{ title }}</span>
          <span class="h-1px flex-1 bg-border" />
        </div>

        <slot />

        <p class="mt-4 text-center text-xs text-muted-foreground">{{ t('login.icp') }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/**
 * koi 的 `.login-background`：三层 radial-gradient 借主题 primary 变量，
 * 不写死调色板值 —— 换主题预设时左栏底色跟着走。
 */
.login-brand-surface {
  background:
    radial-gradient(ellipse 600px 450px at 85% 20%, hsl(var(--primary-500) / 0.1), transparent 70%),
    radial-gradient(500px circle at 25% 80%, hsl(var(--primary-500) / 0.09), transparent 65%),
    radial-gradient(350px circle at 50% 50%, hsl(var(--primary-500) / 0.08), transparent 60%), hsl(var(--background));
}

.dark .login-brand-surface {
  background:
    radial-gradient(ellipse 600px 450px at 85% 20%, hsl(var(--primary-300) / 0.16), transparent 70%),
    radial-gradient(500px circle at 25% 80%, hsl(var(--primary-300) / 0.14), transparent 65%),
    radial-gradient(350px circle at 50% 50%, hsl(var(--primary-300) / 0.12), transparent 60%), hsl(var(--background));
}

/* koi 的 `.glass-overlay`；边框在玻璃层上，不额外加到容器 */
.login-brand-glass {
  background: rgb(255 255 255 / 0.08);
  backdrop-filter: blur(36px);
  -webkit-backdrop-filter: blur(36px);
  border-right: 1px solid rgb(255 255 255 / 0.2);
  pointer-events: none;
}

.dark .login-brand-glass {
  background: rgb(0 0 0 / 0.2);
}

/* koi 的 `float-picture` 关键帧 */
.login-brand-float {
  animation: login-brand-float 5s linear 0ms infinite;
}

@keyframes login-brand-float {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
