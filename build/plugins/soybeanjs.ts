import routerPage from '@soybeanjs/router-page';

export default function createSoybeanjsPlugin() {
  return routerPage({
    pagesFormatter: names => {
      /** 系统的内置路由，该文件夹名称不作为RouteKey */
      const SYSTEM_VIEW = 'system-view';

      const result = names
        .filter(name => name !== SYSTEM_VIEW)
        .map(name => {
          return name.replace(`${SYSTEM_VIEW}_`, '');
        });

      return result;
    }
  });
}
