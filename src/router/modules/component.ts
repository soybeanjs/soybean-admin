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
        i18nTitle: 'routes.component.button',
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
        i18nTitle: 'routes.component.card',
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
        i18nTitle: 'routes.component.table',
        requiresAuth: true,
        icon: 'mdi:table-large'
      }
    }
  ],
  meta: {
    title: '组件示例',
    i18nTitle: 'routes.component._value',
    icon: 'cib:app-store',
    order: 3
  }
};

export default component;
