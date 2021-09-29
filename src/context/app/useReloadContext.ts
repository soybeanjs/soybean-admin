import { ref, nextTick } from 'vue';
import type { Ref } from 'vue';
import { useContext } from '@/hooks';

interface ReloadContext {
  reload: Ref<boolean>;
  handleReload(): void;
}
const { useProvide, useInject: useReloadInject } = useContext<ReloadContext>();

/** 重载上下文 */
export default function useReloadContext() {
  const reload = ref(true);
  function handleReload() {
    reload.value = false;
    nextTick(() => {
      reload.value = true;
    });
  }

  const context: ReloadContext = {
    reload,
    handleReload
  };
  function useReloadProvide() {
    useProvide(context);
  }

  return {
    useReloadProvide,
    useReloadInject
  };
}
