import { ref } from 'vue';

/** 使用勾选协议 */
export default function useAgreement(text = '请勾选 "我已经仔细阅读并接受《用户协议》《隐私权政策》"') {
  const agreement = ref(true);

  function isAgree() {
    let agree = true;
    if (!agreement.value) {
      agree = false;
      window.$message?.error(text);
    }
    return agree;
  }

  return {
    agreement,
    isAgree
  };
}
