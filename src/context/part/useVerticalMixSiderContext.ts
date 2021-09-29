import { ref } from 'vue';
import type { Ref } from 'vue';
import { useContext, useBoolean } from '@/hooks';

interface VerticalMixSiderContext {
  /** 子菜单可见性 */
  childMenuVisible: Ref<boolean>;
  /** 展示子菜单 */
  showChildMenu(): void;
  /** 隐藏子菜单 */
  hideChildMenu(): void;
  /** 鼠标悬浮的一级菜单对应的路由名称 */
  hoverRouteName: Ref<string>;
  /** 设置悬浮路由名称 */
  setHoverRouteName(name: string): void;
  isMouseEnterChildMenu: Ref<boolean>;
  setMouseEnterChildMenu(): void;
  setMouseLeaveChildMenu(): void;
}

const { useProvide, useInject: useVerticalMixSiderInject } = useContext<VerticalMixSiderContext>();

export default function useVerticalMixSiderContext() {
  const { bool: childMenuVisible, setTrue: showChildMenu, setFalse: hideChildMenu } = useBoolean();
  const {
    bool: isMouseEnterChildMenu,
    setTrue: setMouseEnterChildMenu,
    setFalse: setMouseLeaveChildMenu
  } = useBoolean();

  const hoverRouteName = ref('');
  function setHoverRouteName(name: string) {
    hoverRouteName.value = name;
  }

  const context: VerticalMixSiderContext = {
    childMenuVisible,
    showChildMenu,
    hideChildMenu,
    hoverRouteName,
    setHoverRouteName,
    isMouseEnterChildMenu,
    setMouseEnterChildMenu,
    setMouseLeaveChildMenu
  };
  function useVerticalMixSiderProvide() {
    useProvide(context);
  }

  return {
    useVerticalMixSiderProvide,
    useVerticalMixSiderInject
  };
}
