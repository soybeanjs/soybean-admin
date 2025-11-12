import { computed, reactive, ref } from 'vue';
import { useLoading } from '@sa/hooks';
import type { ClickDot } from 'go-captcha-vue/dist/components/click/meta/data.js';
import type { ClickExpose } from 'go-captcha-vue/dist/components/click/meta/expose.js';
import {
  fetchCloseClickCaptcha,
  fetchGetClickCaptcha,
  fetchRefreshClickCaptcha,
  fetchValidateClickCaptcha
} from '@/service/api';
import { $t } from '@/locales';

// 坐标调整常量
const COORDINATE_OFFSET = { X: 16, Y: 19 } as const;

export function useClickCaptcha() {
  const { loading, startLoading, endLoading } = useLoading();
  const captchaData = ref<Api.Auth.ClickCaptchaBackendData | null>(null);
  const captchaVerified = ref(false);
  const captchaShow = ref(false);
  const captchaToken = ref<string | undefined>(undefined);
  const captchaDomRef = ref<ClickExpose | null>(null);

  const clickData = reactive({
    image: '',
    thumb: ''
  });

  // 使用计算属性来响应语言变化
  const title = computed(() => $t('page.login.captcha.title'));
  const buttonText = computed(() => $t('page.login.captcha.confirmText'));

  const clickConfigData = reactive({
    width: 300,
    height: 220,
    title,
    buttonText,
    verticalPadding: 0,
    horizontalPadding: 0,
    showTheme: false
  });

  // 统一的错误处理函数
  const showError = (message: string, err?: unknown) => {
    const errorMsg = err instanceof Error ? err.message : message;
    window.$message?.error(`${$t('page.login.captcha.validateFailed')}：${errorMsg}`);
  };

  // 重置验证码显示状态
  const resetCaptchaDisplay = () => {
    captchaDomRef.value?.clear();
    captchaDomRef.value?.refresh();
  };

  // 坐标转换
  const adjustCoordinates = (dots: ClickDot[]): ClickDot[] =>
    dots.map(dot => ({
      ...dot,
      x: Math.round(dot.x - COORDINATE_OFFSET.X),
      y: Math.round(dot.y - COORDINATE_OFFSET.Y)
    }));

  // 更新验证码数据
  const updateCaptchaData = (data: Api.Auth.ClickCaptchaBackendData) => {
    captchaData.value = data;
    clickData.image = data.image;
    clickData.thumb = data.thumb;
  };

  // 验证码验证
  const onCaptchaVerify = async (dots: ClickDot[]): Promise<boolean> => {
    if (!captchaData.value?.captchaKey) {
      showError('验证码数据无效');
      return false;
    }

    try {
      const { data, error } = await fetchValidateClickCaptcha({
        captchaKey: captchaData.value.captchaKey,
        clickDots: adjustCoordinates(dots)
      });

      if (!error && data) {
        captchaVerified.value = true;
        captchaShow.value = false;
        captchaToken.value = data.captchaToken;
        window.$message?.success($t('page.login.captcha.validateSuccess'));
        return true;
      }

      // 验证失败时重置显示
      captchaVerified.value = false;
      resetCaptchaDisplay();
      return false;
    } catch (err) {
      captchaVerified.value = false;
      resetCaptchaDisplay();
      showError('验证失败', err);
      return false;
    }
  };

  // 验证码事件处理
  const clickEvents = reactive({
    refresh: () => captchaData.value?.captchaKey && refreshCaptcha(captchaData.value.captchaKey),
    close: () => captchaData.value?.captchaKey && resetCaptcha(captchaData.value.captchaKey),
    confirm: async (dots: ClickDot[], reset: () => void) => {
      if (dots?.length > 0) {
        const verified = await onCaptchaVerify(dots);
        if (verified) reset();
        return verified;
      }
      reset();
      return false;
    }
  });

  // 刷新验证码
  async function refreshCaptcha(captchaKey: string) {
    if (loading.value || !captchaKey) return null;

    startLoading();
    try {
      const { data, error } = await fetchRefreshClickCaptcha(captchaKey);
      if (!error && data) {
        updateCaptchaData(data);
        return data;
      }
      throw new Error(error?.message || '刷新验证码失败');
    } catch (err) {
      showError('刷新验证码失败', err);
      return null;
    } finally {
      endLoading();
    }
  }

  // 获取验证码数据
  async function getCaptchaData() {
    if (loading.value) return null;

    startLoading();
    try {
      const { data, error } = await fetchGetClickCaptcha();
      if (!error && data) {
        updateCaptchaData(data);
        return data;
      }
      throw new Error(error?.message || '获取验证码失败');
    } catch (err) {
      showError('获取验证码失败', err);
      return null;
    } finally {
      endLoading();
    }
  }

  // 重置验证码状态
  async function resetCaptcha(captchaKey: string) {
    if (!captchaKey) {
      captchaShow.value = false;
      return;
    }

    try {
      const { data, error } = await fetchCloseClickCaptcha(captchaKey);
      if (!error) {
        captchaVerified.value = false;
        captchaToken.value = undefined;
        if (data) updateCaptchaData(data);
        else {
          clickData.image = '';
          clickData.thumb = '';
        }
      }
    } catch (err) {
      showError('重置验证码失败', err);
    } finally {
      captchaShow.value = false;
    }
  }

  return {
    captchaShow,
    captchaData,
    captchaVerified,
    captchaToken,
    clickData,
    clickConfigData,
    clickEvents,
    getCaptchaData,
    resetCaptcha,
    captchaDomRef
  };
}
