import type { LocaleMessages } from 'vue-i18n';
import { useAppInfo } from '@/composables';

const { name } = useAppInfo();

const locale: LocaleMessages<I18nType.Schema> = {
  message: {
    system: {
      title: name
    },
    routes: {
      dashboard: {
        dashboard: 'Dashboard',
        analysis: 'Analysis',
        workbench: 'Workbench'
      },
      about: {
        about: 'About'
      }
    }
  }
};

export default locale;
