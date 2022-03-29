const dashboard: AuthRoute.Route = {
  name: 'dashboard',
  path: '/dashboard',
  component: 'basic',
  children: [
    {
      name: 'dashboard_analysis',
      path: '/dashboard/analysis',
      component: 'self',
      meta: {
        title: '分析页',
        requiresAuth: true,
        icon: 'icon-park-outline:analysis',
      },
    },
    {
      name: 'dashboard_workbench',
      path: '/dashboard/workbench',
      component: 'self',
      meta: {
        title: '工作台',
        requiresAuth: true,
        permissions: ['super', 'admin'],
        icon: 'icon-park-outline:workbench',
      },
    },
  ],
  meta: {
    title: '仪表盘',
    icon: 'carbon:dashboard',
    order: 1,
  },
};

export default dashboard;
