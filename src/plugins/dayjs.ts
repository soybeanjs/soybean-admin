import { extend } from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import { setDayjsLocale } from '../locales/dayjs';

export function setupDayjs() {
  extend(localeData);

  setDayjsLocale();
}
