import zhCN from './lang/zh-CN';
import en from './lang/en';
import kmKH from './lang/km-KH';

const locales: Record<I18nType.LangType, I18nType.Schema> = {
  'zh-CN': zhCN,
  en,
  'km-KH': kmKH
};

export default locales;
