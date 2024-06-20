import { useTitle } from '@vueuse/core';
import type { Router } from 'vue-router';
import { $t } from '@/locales';

export function createDocumentTitleGuard(router: Router) {
  router.afterEach(to => {
    const { i18nKey, title } = to.meta;

    const documentTitle = i18nKey ? $t(i18nKey) : title;

    changeDocumentTitle(documentTitle);
  });
}

export function changeDocumentTitle(documentTitle: string) {
  useTitle(documentTitle, {
    titleTemplate: `%s | ${import.meta.env.VITE_APP_TITLE}`
  });
}
