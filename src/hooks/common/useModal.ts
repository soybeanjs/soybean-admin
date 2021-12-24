import { createVNode, render, getCurrentInstance, nextTick } from 'vue';
import type { AppContext, ComponentInternalInstance } from 'vue';
import { Modal } from '@/components';
import type { HookModalProps } from '@/components/common/Modal/index.vue';

export default function useModal() {
  let modalInstance: ComponentInternalInstance;
  const appContext = getCurrentInstance()?.appContext as AppContext;

  function getModalInstance() {
    if (modalInstance) {
      return modalInstance;
    }
    const container = document.createElement('template');
    const VNode = createVNode(Modal);
    VNode.appContext = appContext;
    render(VNode, container);
    modalInstance = VNode.component!;
    modalInstance.props.closeModal = hideModal;

    return modalInstance;
  }

  async function showModal(props: HookModalProps) {
    const modalInstance = getModalInstance();

    Object.assign<any, HookModalProps>(modalInstance?.props, {
      ...props,
      show: true
    });

    await nextTick();
  }

  function hideModal() {
    Object.assign<any, HookModalProps>(modalInstance?.props, { show: false });
  }

  return {
    showModal,
    hideModal
  };
}

export type ModalInstance = ReturnType<typeof useModal>;
