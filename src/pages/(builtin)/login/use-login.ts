import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/store/modules/auth';
import { api } from '@/request';
import type { CaptchaResult } from '@/schema/auth';

/** 登录页公共逻辑（v3 §4.6） 详见 docs/v3-notes.md N-298。 */

/** 可用模块（与 `?module=` 取值一一对应；`pwd-login` 为默认模块） */
export const LOGIN_MODULES = ['pwd-login', 'code-login', 'register', 'reset-pwd', 'bind-wechat'] as const;

export type LoginModule = (typeof LOGIN_MODULES)[number];

/** 模块取值集合（`Set<string>` 让 `has` 接受任意字符串，避免 `as` 断言） */
const loginModuleSet: ReadonlySet<string> = new Set<string>(LOGIN_MODULES);

/** 模块标识类型守卫 */
function isLoginModule(value: unknown): value is LoginModule {
  return typeof value === 'string' && loginModuleSet.has(value);
}

/**
 * 由 `?module=` 解析当前模块（非法/缺省都回落 `pwd-login`）。
 */
export function resolveLoginModule(value: unknown): LoginModule {
  return isLoginModule(value) ? value : 'pwd-login';
}

/** 模块切换器：`replace` 而非 `push`（不污染历史），并保留 `?redirect=` 等既有query —— 在注册/重置密码之间来回切换时回跳目标不丢。 */
export function useLoginModuleNavigate() {
  const router = useRouter();

  return (module: LoginModule): void => {
    const query: Record<string, string> = {};

    for (const [key, value] of Object.entries(router.currentRoute.value.query)) {
      if (typeof value === 'string' && key !== 'module') query[key] = value;
    }
    if (module !== 'pwd-login') query.module = module;

    void router.replace({ query });
  };
}

/** 回跳目标：`query.redirect`（守卫写入的来源页）优先，其次用户 `homePath`。 */
export function useLoginRedirect() {
  const route = useRoute();
  const authStore = useAuthStore();

  return computed(() => {
    const redirect = route.query.redirect;

    return typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//')
      ? redirect
      : authStore.homePath;
  });
}

/**
 * 图形验证码（验证码登录 / 重置密码共用）：拉取即刷新，`captchaId` 随表单提交、服务端校验一次即消费 —— 校验失败后必须重新拉取。
 */
export function useLoginCaptcha() {
  const captcha = ref<CaptchaResult | null>(null);
  const loading = ref(false);

  async function refreshCaptcha(): Promise<void> {
    loading.value = true;

    try {
      captcha.value = await api.get('/auth/captcha');
    } catch {
      // 网络/服务端异常已由请求层 toast
    } finally {
      loading.value = false;
    }
  }

  return { captcha, loading, refreshCaptcha };
}
