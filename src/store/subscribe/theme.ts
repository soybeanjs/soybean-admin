import { useThemeStore } from '../modules';

/** 订阅app store */
export default function subscribeAppStore() {
  const theme = useThemeStore();
  const { addDarkClass, removeDarkClass } = handleWindicssDarkMode();

  theme.$subscribe((_mutation, state) => {
    // 监听暗黑模式
    if (state.darkMode) {
      addDarkClass();
    } else {
      removeDarkClass();
    }
  });
}

/** windicss 暗黑模式 */
function handleWindicssDarkMode() {
  const DARK_CLASS = 'dark';
  function addDarkClass() {
    document.documentElement.classList.add(DARK_CLASS);
  }
  function removeDarkClass() {
    document.documentElement.classList.remove(DARK_CLASS);
  }
  return {
    addDarkClass,
    removeDarkClass
  };
}
