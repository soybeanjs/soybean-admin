import { ref } from 'vue';
import type { Ref } from 'vue';
import { useContext } from '@/hooks';

interface DemoContext {
  counts: Ref<number>;
  setCounts: (count: number) => void;
}

const { useProvide: useDemoProvide, useInject: useDemoInject } = useContext<DemoContext>();

export function useDemoContext() {
  const counts = ref(0);

  function setCounts(count: number) {
    counts.value = count;
  }

  const demoContext: DemoContext = {
    counts,
    setCounts
  };

  function useProvide() {
    return useDemoProvide(demoContext);
  }

  return {
    useProvide,
    useInject: useDemoInject
  };
}

// 示例用法: A.vue为父组件， B.vue为子孙组件 C.vue为子孙组件
// A.vue
// import { useDemoContext } from '@/context';
// const { useProvide } = useDemoContext();
// const { counts, setCounts } = useProvide();

// B.vue 和 C.vue : 共享状态 counts
// import { useDemoContext } from '@/context';
// const { useInject } = useDemoContext();
// const { counts, setCounts } = useInject();
