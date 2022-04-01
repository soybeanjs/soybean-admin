const about: AuthRoute.Route = {
  name: 'about',
  path: '/about',
  component: 'self',
  meta: {
    title: '关于',
    requiresAuth: true,
    singleLayout: 'basic',
    permissions: ['super', 'admin', 'test'],
    icon: 'fluent:book-information-24-regular',
    order: 7
  }
};

export default about;
