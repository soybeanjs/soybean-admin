import { ref } from 'vue';

export default function useBoolean(initValue: boolean = false) {
  const bool = ref(initValue);

  function setTrue() {
    bool.value = true;
  }

  function setFalse() {
    bool.value = false;
  }

  function toggle() {
    bool.value = !bool.value;
  }

  return {
    bool,
    setTrue,
    setFalse,
    toggle
  };
}
