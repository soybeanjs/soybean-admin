import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { fetchCaptcha } from '@/service/api/auth';
import { useAuthStore } from '@/store/modules/auth';
import { getRouter } from '@/router/instance';
import type { ApiCaptcha } from '@/typings/app';

/**
 * 登录页公共逻辑（v3 §4.6）。
 *
 * 登录页是**单路由多模块**：`/login?module=<模块>` 决定渲染哪个子组件，
 * 与 v2 的 `src/views/_builtin/login/modules/*` 结构一致 —— 免去为 5 个
 * 页面各建一条路由，回跳（`?redirect=`）与页签语义也更简单。
 */

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

/**
 * 切换模块：`replace` 而非 `push`（不污染历史），并保留 `?redirect=` 等既有
 * query —— 在注册/重置密码之间来回切换时回跳目标不丢。
 */
export function gotoLoginModule(module: LoginModule): void {
  const router = getRouter();
  const query: Record<string, string> = {};

  for (const [key, value] of Object.entries(router.currentRoute.value.query)) {
    if (typeof value === 'string' && key !== 'module') query[key] = value;
  }
  if (module !== 'pwd-login') query.module = module;

  void router.replace({ query });
}

/**
 * 回跳目标：`query.redirect`（守卫写入的来源页）优先，其次用户 `homePath`。
 * 只接受站内绝对路径，避免开放重定向。
 */
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
 * 图形验证码（验证码登录 / 重置密码共用）：拉取即刷新，`captchaId` 随表单
 * 提交、服务端校验一次即消费 —— 校验失败后必须重新拉取。
 */
export function useLoginCaptcha() {
  const captcha = ref<ApiCaptcha | null>(null);
  const loading = ref(false);

  async function refreshCaptcha(): Promise<void> {
    loading.value = true;

    try {
      captcha.value = await fetchCaptcha();
    } catch {
      // 网络/服务端异常已由请求层 toast
    } finally {
      loading.value = false;
    }
  }

  return { captcha, loading, refreshCaptcha };
}
