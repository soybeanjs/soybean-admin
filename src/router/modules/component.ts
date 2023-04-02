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
    },
    {
      name: 'component_tree',
      path: '/component/tree',
      component: 'multi',
      children: [
        {
          name: 'component_tree_tree-basic',
          path: '/component/tree/tree-basic',
          component: 'self',
          meta: {
            title: '基础树',
            requiresAuth: true,
            icon: 'fluent:tree-deciduous-20-regular'
          }
        },
        {
          name: 'component_tree_tree-custom',
          path: '/component/tree/tree-custom',
          component: 'self',
          meta: {
            title: '自定义树',
            requiresAuth: true,
            icon: 'fluent:tree-deciduous-20-filled'
          }
        },
        {
          name: 'component_tree_tree-functions',
          path: '/component/tree/tree-functions',
          component: 'self',
          meta: {
            title: '函数示例',
            requiresAuth: true,
            icon: 'fluent:tree-evergreen-20-filled'
          }
        }
      ],
      meta: {
        title: '树',
        requiresAuth: true,
        icon: 'carbon:tree-view-alt'
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
