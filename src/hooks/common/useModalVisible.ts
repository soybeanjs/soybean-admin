import { computed, watch, onUnmounted } from 'vue';
import type { ComputedRef } from 'vue';
import useBoolean from './useBoolean';

interface ScrollBodyStyle {
  overflow: string;
  paddingRight: string;
}

/**
 * 使用弹窗
 * @param hideScroll - 关闭html滚动条
 * @param duration - 显示滚动条的延迟时间
 */
export default function useModalVisible(hideScroll = true, duration = 300) {
  const { bool: visible, setTrue: openModal, setFalse: closeModal, toggle: toggleModal } = useBoolean();

  const defaultStyle: ScrollBodyStyle = {
    overflow: '',
    paddingRight: ''
  };
  function getInitBodyStyle() {
    if (hideScroll) {
      const { overflow, paddingRight } = document.body.style;
      Object.assign(defaultStyle, { overflow, paddingRight });
    }
  }
  function setScrollBodyStyle() {
    document.body.style.paddingRight = `${window.innerWidth - document.body.clientWidth}px`;
    document.body.style.overflow = 'hidden';
  }
  function resetScrollBodyStyle() {
    document.body.style.overflow = defaultStyle.overflow;
    document.body.style.paddingRight = defaultStyle.paddingRight;
  }

  function modalVisibleWatcher(visible: ComputedRef<boolean>) {
    const stopHandle = watch(visible, async newValue => {
      if (hideScroll) {
        if (newValue) {
          setScrollBodyStyle();
        } else {
          setTimeout(() => {
            resetScrollBodyStyle();
          }, duration);
        }
      }
    });

    onUnmounted(() => {
      stopHandle();
    });
  }

  function init() {
    getInitBodyStyle();
    modalVisibleWatcher(computed(() => visible.value));
  }

  init();

  return {
    visible,
    openModal,
    closeModal,
    toggleModal,
    modalVisibleWatcher
  };
}
