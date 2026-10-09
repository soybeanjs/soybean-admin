import enUS from './langs/en-us';
import zhCN from './langs/zh-cn';

const locales: Record<App.I18n.LangType, App.I18n.Schema> = {
  'zh-CN': zhCN,
  'en-US': enUS
};

export default locales;
