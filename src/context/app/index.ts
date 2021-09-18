import useReloadContext from './useReloadContext';

const { useReloadProvide, useReloadInject } = useReloadContext();

/** 从App组件注入provide */
function setupAppContext() {
  useReloadProvide();
}

export { setupAppContext, useReloadInject };
