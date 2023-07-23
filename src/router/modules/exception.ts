const exception: AuthRoute.Route = {
  name: 'exception',
  path: '/exception',
  component: 'basic',
  children: [
    {
      name: 'exception_403',
      path: '/exception/403',
      component: 'self',
      meta: {
        title: '异常页403',
        i18nTitle: 'routes.exception.403',
        requiresAuth: true,
        icon: 'ic:baseline-block'
      }
    },
    {
      name: 'exception_404',
      path: '/exception/404',
      component: 'self',
      meta: {
        title: '异常页404',
        i18nTitle: 'routes.exception.404',
        requiresAuth: true,
        icon: 'ic:baseline-web-asset-off'
      }
    },
    {
      name: 'exception_500',
      path: '/exception/500',
      component: 'self',
      meta: {
        title: '异常页500',
        i18nTitle: 'routes.exception.500',
        requiresAuth: true,
        icon: 'ic:baseline-wifi-off'
      }
    }
  ],
  meta: {
    i18nTitle: 'routes.exception._value',
    title: '异常页',
    icon: 'ant-design:exception-outlined',
    order: 7
  }
};

export default exception;
