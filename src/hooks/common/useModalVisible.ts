import { watch, onUnmounted } from 'vue';
import useBoolean from './useBoolean';

/**
 * 使用弹窗
 * @param hide - 关闭html滚动条
 */
export default function useModalVisible(hideScroll = true) {
  const { bool: visible, setTrue: openModal, setFalse: closeModal, toggle: toggleModal } = useBoolean();

  const stopHandle = watch(visible, async newValue => {
    if (hideScroll) {
      const className = 'overflow-hidden';
      if (newValue) {
        document.body.classList.add(className);
      } else {
        setTimeout(() => {
          document.body.classList.remove(className);
        }, 300);
      }
    }
  });

  onUnmounted(() => {
    stopHandle();
  });

  return {
    visible,
    openModal,
    closeModal,
    toggleModal
  };
}
