import { onUnmounted } from 'vue';
import useLoading from './useLoading';
import useBoolean from './useBoolean';

export default function useScript(src: string) {
  const { loading, startLoading, endLoading } = useLoading();
  const { bool: isSuccess, setTrue: setIsSuccess, setFalse: setNotSuccess } = useBoolean();

  let script: HTMLScriptElement;
  function removeScript() {
    if (script) {
      script.remove();
    }
  }

  function load() {
    startLoading();
    return new Promise((resolve, reject) => {
      script = document.createElement('script');
      script.type = 'text/javascript';
      script.onload = () => {
        endLoading();
        setIsSuccess();
        resolve('');
      };
      script.onerror = err => {
        endLoading();
        setNotSuccess();
        reject(err);
      };
      script.src = src;
      document.head.appendChild(script);
    });
  }

  onUnmounted(() => {
    removeScript();
  });

  return {
    loading,
    isSuccess,
    load
  };
}
