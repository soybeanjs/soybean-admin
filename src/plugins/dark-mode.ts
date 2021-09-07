import { watch } from 'vue';
import { useThemeStore } from '@/store';

export default function setupWindicssDarkMode() {
  const theme = useThemeStore();

  const DARK_CLASS = 'dark';

  function getHtmlElement() {
    return document.querySelector('html')!;
  }
  function addDarkClass() {
    const html = getHtmlElement();
    html.classList.add(DARK_CLASS);
  }
  function removeDarkClass() {
    const html = getHtmlElement();
    html.classList.remove(DARK_CLASS);
  }

  watch(
    () => theme.darkMode,
    newValue => {
      if (newValue) {
        addDarkClass();
      } else {
        removeDarkClass();
      }
    }
  );
}
