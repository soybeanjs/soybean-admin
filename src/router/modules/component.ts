const component: AuthRoute.Route = {
  name: 'component',
  path: '/component',
  component: 'basic',
  children: [
    {
      name: 'component_button',
      path: '/component/button',
      component: 'self',
      meta: {
        title: '按钮',
        requiresAuth: true,
        icon: 'mdi:button-cursor'
      }
    },
    {
      name: 'component_card',
      path: '/component/card',
      component: 'self',
      meta: {
        title: '卡片',
        requiresAuth: true,
        icon: 'mdi:card-outline'
      }
    },
    {
      name: 'component_table',
      path: '/component/table',
      component: 'self',
      meta: {
        title: '表格',
        requiresAuth: true,
        icon: 'mdi:table-large'
      }
    }
  ],
  meta: {
    title: '组件示例',
    icon: 'cib:app-store',
    order: 3
  }
};

export default component;
