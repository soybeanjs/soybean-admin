import { watch, onUnmounted } from 'vue';
import useBoolean from './useBoolean';
import useBodyScroll from './useBodyScroll';

/**
 * 使用弹窗
 * @param hideScroll - 关闭html滚动条
 */
export default function useModalVisible(hideScroll = true) {
  const { bool: visible, setTrue: openModal, setFalse: closeModal, toggle: toggleModal } = useBoolean();
  const { scrollBodyHandler } = useBodyScroll();

  function modalVisibleWatcher() {
    const stopHandle = watch(visible, async newValue => {
      scrollBodyHandler(newValue);
    });

    onUnmounted(() => {
      stopHandle();
    });
  }

  if (hideScroll) {
    modalVisibleWatcher();
  }

  return {
    visible,
    openModal,
    closeModal,
    toggleModal
  };
}
