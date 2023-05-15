const component: any = {
  name: 'crud',
  path: '/crud',
  component: 'basic',
  meta: {
    title: 'CRUD示例',
    requiresAuth: true,
    icon: 'mdi:table-large',
    order: 4
  },
  children: [
    {
      name: 'crud_demo',
      path: '/crud/demo',
      component: 'self',
      meta: {
        title: '基本示例',
        requiresAuth: true,
        icon: 'mdi:button-cursor'
      }
    },
    {
      name: 'crud_header_group',
      path: '/crud/header_group',
      component: 'self',
      meta: {
        title: '多级表头',
        requiresAuth: true,
        icon: 'mdi:button-cursor'
      }
    },
    {
      name: 'crud_doc',
      path: '/crud/doc',
      component: 'self',
      meta: {
        title: 'FastCrud文档',
        requiresAuth: true,
        icon: 'logos:vue'
      }
    }
  ]
};

export default component;
