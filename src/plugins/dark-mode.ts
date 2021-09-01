import { watch } from 'vue';
import { useAppStore } from '@/store';

export default function setupWindicssDarkMode() {
  const app = useAppStore();

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
    () => app.themeSettings.darkMode,
    newValue => {
      if (newValue) {
        addDarkClass();
      } else {
        removeDarkClass();
      }
    }
  );
}
