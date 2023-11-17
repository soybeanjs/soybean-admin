import useBoolean from './use-boolean';

/**
 * loading
 * @param initValue init value
 */
export default function useLoading(initValue = false) {
  const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean(initValue);

  return {
    loading,
    startLoading,
    endLoading
  };
}
