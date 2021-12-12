import { computed } from 'vue';
import { REGEXP_PHONE } from '@/config';
import useCountDown from './useCountDown';

export default function useSmsCode() {
  const { counts, start, isCounting } = useCountDown(60);
  const initLabel = '获取验证码';
  const countingLabel = (second: number) => `${second}秒后重新获取`;
  const label = computed(() => (isCounting.value ? countingLabel(counts.value) : initLabel));

  /** 判断手机号码格式是否正确 */
  function isPhoneValid(phone: string) {
    let valid = true;
    if (phone.trim() === '') {
      window.$message?.error('手机号码不能为空！');
      valid = false;
    } else if (!REGEXP_PHONE.test(phone)) {
      window.$message?.error('手机号码格式错误！');
      valid = false;
    }
    return valid;
  }

  /**
   * 获取短信验证码
   * @param phone - 手机号
   */
  async function getSmsCode(phone: string) {
    const valid = isPhoneValid(phone);
    if (!valid) return;
    // 该处调用验证码接口
    window.$message?.success('验证码发送成功！');
    start();
  }

  return {
    label,
    start,
    isCounting,
    getSmsCode
  };
}
