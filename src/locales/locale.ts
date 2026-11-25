import enUS from './langs/en-us.json';
import zhCN from './langs/zh-cn.json';

const locales = {
  'zh-CN': zhCN,
  'en-US': enUS
} satisfies Record<App.I18n.LangType, App.I18n.Schema>;

export default locales;
