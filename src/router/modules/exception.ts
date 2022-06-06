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
        requiresAuth: true,
        icon: 'ic:baseline-wifi-off'
      }
    }
  ],
  meta: {
    title: '异常页',
    icon: 'ant-design:exception-outlined',
    order: 7
  }
};

export default exception;
