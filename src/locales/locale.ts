import zhCN from './lang/zh-cn';
import enUS from './lang/en-us';

const locales: Record<App.I18n.LangType, App.I18n.Schema> = {
  'zh-CN': zhCN,
  'en-US': enUS
};

export default locales;
