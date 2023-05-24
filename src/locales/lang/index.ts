import zhCN from './zh-cn';
import en from './en';
import kmKH from './km-KH';

const locales = {
  'zh-CN': zhCN,
  en,
  'km-KH': kmKH
};

export type LocaleKey = keyof typeof locales;

export default locales;
