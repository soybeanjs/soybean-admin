import useBoolean from './useBoolean';

export default function useLoading(initValue: boolean = false) {
  const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean(initValue);

  return {
    loading,
    startLoading,
    endLoading
  };
}
