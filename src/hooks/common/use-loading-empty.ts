import useBoolean from './use-boolean';

export default function useLoadingEmpty(initLoading = false, initEmpty = false) {
  const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean(initLoading);
  const { bool: empty, setBool: setEmpty } = useBoolean(initEmpty);

  return {
    loading,
    startLoading,
    endLoading,
    empty,
    setEmpty
  };
}
