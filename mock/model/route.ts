export const routeModel: Record<Auth.RoleType, AuthRoute.Route[]> = {
  super: [
    {
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
            icon: 'icon-park-outline:analysis'
          }
        },
        {
          name: 'dashboard_workbench',
          path: '/dashboard/workbench',
          component: 'self',
          meta: {
            title: '工作台',
            requiresAuth: true,
            icon: 'icon-park-outline:workbench'
          }
        }
      ],
      meta: {
        title: '仪表盘',
        icon: 'carbon:dashboard',
        order: 1
      }
    },
    {
      name: 'document',
      path: '/document',
      component: 'basic',
      children: [
        {
          name: 'document_vue',
          path: '/document/vue',
          component: 'self',
          meta: {
            title: 'vue文档',
            requiresAuth: true,
            icon: 'mdi:vuejs'
          }
        },
        {
          name: 'document_vue-new',
          path: '/document/vue-new',
          component: 'self',
          meta: {
            title: 'vue文档(新版)',
            requiresAuth: true,
            icon: 'mdi:vuejs'
          }
        },
        {
          name: 'document_vite',
          path: '/document/vite',
          component: 'self',
          meta: {
            title: 'vite文档',
            requiresAuth: true,
            icon: 'simple-icons:vite'
          }
        },
        {
          name: 'document_project',
          path: '/document/project',
          meta: {
            title: '项目文档(外链)',
            requiresAuth: true,
            icon: 'mdi:file-link-outline',
            href: 'https://docs.soybean.pro/'
          }
        }
      ],
      meta: {
        title: '文档',
        icon: 'carbon:document',
        order: 2
      }
    },
    {
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
            icon: 'ic:baseline-radio-button-checked'
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
        icon: 'fluent:app-store-24-regular',
        order: 3
      }
    },
    {
      name: 'auth-demo',
      path: '/auth-demo',
      component: 'basic',
      children: [
        {
          name: 'auth-demo_permission',
          path: '/auth-demo/permission',
          component: 'self',
          meta: {
            title: '权限切换',
            requiresAuth: true,
            icon: 'ic:round-construction'
          }
        },
        {
          name: 'auth-demo_super',
          path: '/auth-demo/super',
          component: 'self',
          meta: {
            title: '超级管理员可见',
            requiresAuth: true,
            icon: 'ic:round-supervisor-account'
          }
        }
      ],
      meta: {
        title: '权限示例',
        icon: 'ic:baseline-security',
        order: 5
      }
    },
    {
      name: 'function',
      path: '/function',
      component: 'basic',
      children: [
        {
          name: 'function_tab',
          path: '/function/tab',
          component: 'self',
          meta: {
            title: 'Tab',
            requiresAuth: true,
            icon: 'ic:round-tab'
          }
        },
        {
          name: 'function_tab-detail',
          path: '/function/tab-detail',
          component: 'self',
          meta: {
            title: 'Tab Detail',
            requiresAuth: true,
            hide: true,
            activeMenu: 'function_tab',
            icon: 'ic:round-tab'
          }
        },
        {
          name: 'function_tab-multi-detail',
          path: '/function/tab-multi-detail',
          component: 'self',
          meta: {
            title: 'Tab Multi Detail',
            requiresAuth: true,
            hide: true,
            multiTab: true,
            activeMenu: 'function_tab',
            icon: 'ic:round-tab'
          }
        }
      ],
      meta: {
        title: '功能',
        icon: 'ri:function-line',
        order: 6
      }
    },
    {
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
    },
    {
      name: 'multi-menu',
      path: '/multi-menu',
      component: 'basic',
      children: [
        {
          name: 'multi-menu_first',
          path: '/multi-menu/first',
          component: 'multi',
          children: [
            {
              name: 'multi-menu_first_second',
              path: '/multi-menu/first/second',
              component: 'self',
              meta: {
                title: '二级菜单',
                requiresAuth: true,
                icon: 'ic:outline-menu'
              }
            },
            {
              name: 'multi-menu_first_second-new',
              path: '/multi-menu/first/second-new',
              component: 'multi',
              children: [
                {
                  name: 'multi-menu_first_second-new_third',
                  path: '/multi-menu/first/second-new/third',
                  component: 'self',
                  meta: {
                    title: '三级菜单',
                    requiresAuth: true,
                    icon: 'ic:outline-menu'
                  }
                }
              ],
              meta: {
                title: '二级菜单(有子菜单)',
                icon: 'ic:outline-menu'
              }
            }
          ],
          meta: {
            title: '一级菜单',
            icon: 'ic:outline-menu'
          }
        }
      ],
      meta: {
        title: '多级菜单',
        icon: 'carbon:menu',
        order: 8
      }
    },
    {
      name: 'management',
      path: '/management',
      component: 'basic',
      children: [
        {
          name: 'management_auth',
          path: '/management/auth',
          component: 'self',
          meta: {
            title: '权限管理',
            requiresAuth: true,
            icon: 'ic:baseline-security'
          }
        },
        {
          name: 'management_role',
          path: '/management/role',
          component: 'self',
          meta: {
            title: '角色管理',
            requiresAuth: true,
            icon: 'carbon:user-role'
          }
        },
        {
          name: 'management_user',
          path: '/management/user',
          component: 'self',
          meta: {
            title: '用户管理',
            requiresAuth: true,
            icon: 'ic:round-manage-accounts'
          }
        },
        {
          name: 'management_route',
          path: '/management/route',
          component: 'self',
          meta: {
            title: '路由管理',
            requiresAuth: true,
            icon: 'material-symbols:route'
          }
        }
      ],
      meta: {
        title: '系统管理',
        icon: 'carbon:cloud-service-management',
        order: 9
      }
    },
    {
      name: 'about',
      path: '/about',
      component: 'self',
      meta: {
        title: '关于',
        requiresAuth: true,
        singleLayout: 'basic',
        icon: 'fluent:book-information-24-regular',
        order: 10
      }
    }
  ],
  admin: [
    {
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
            icon: 'icon-park-outline:analysis'
          }
        },
        {
          name: 'dashboard_workbench',
          path: '/dashboard/workbench',
          component: 'self',
          meta: {
            title: '工作台',
            requiresAuth: true,
            icon: 'icon-park-outline:workbench'
          }
        }
      ],
      meta: {
        title: '仪表盘',
        icon: 'carbon:dashboard',
        order: 1
      }
    },
    {
      name: 'document',
      path: '/document',
      component: 'basic',
      children: [
        {
          name: 'document_vue',
          path: '/document/vue',
          component: 'self',
          meta: {
            title: 'vue文档',
            requiresAuth: true,
            icon: 'mdi:vuejs'
          }
        },
        {
          name: 'document_vue-new',
          path: '/document/vue-new',
          component: 'self',
          meta: {
            title: 'vue文档(新版)',
            requiresAuth: true,
            icon: 'mdi:vuejs'
          }
        },
        {
          name: 'document_vite',
          path: '/document/vite',
          component: 'self',
          meta: {
            title: 'vite文档',
            requiresAuth: true,
            icon: 'simple-icons:vite'
          }
        },
        {
          name: 'document_project',
          path: '/document/project',
          meta: {
            title: '项目文档(外链)',
            requiresAuth: true,
            icon: 'mdi:file-link-outline',
            href: 'https://docs.soybean.pro/'
          }
        }
      ],
      meta: {
        title: '文档',
        icon: 'carbon:document',
        order: 2
      }
    },
    {
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
            icon: 'ic:baseline-radio-button-checked'
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
        icon: 'fluent:app-store-24-regular',
        order: 3
      }
    },
    {
      name: 'auth-demo',
      path: '/auth-demo',
      component: 'basic',
      children: [
        {
          name: 'auth-demo_permission',
          path: '/auth-demo/permission',
          component: 'self',
          meta: {
            title: '权限切换',
            requiresAuth: true,
            icon: 'ic:round-construction'
          }
        }
      ],
      meta: {
        title: '权限示例',
        icon: 'ic:baseline-security',
        order: 5
      }
    },
    {
      name: 'function',
      path: '/function',
      component: 'basic',
      children: [
        {
          name: 'function_tab',
          path: '/function/tab',
          component: 'self',
          meta: {
            title: 'Tab',
            requiresAuth: true,
            icon: 'ic:round-tab'
          }
        },
        {
          name: 'function_tab-detail',
          path: '/function/tab-detail',
          component: 'self',
          meta: {
            title: 'Tab Detail',
            requiresAuth: true,
            hide: true,
            activeMenu: 'function_tab',
            icon: 'ic:round-tab'
          }
        },
        {
          name: 'function_tab-multi-detail',
          path: '/function/tab-multi-detail',
          component: 'self',
          meta: {
            title: 'Tab Multi Detail',
            requiresAuth: true,
            hide: true,
            multiTab: true,
            activeMenu: 'function_tab',
            icon: 'ic:round-tab'
          }
        }
      ],
      meta: {
        title: '功能',
        icon: 'ri:function-line',
        order: 6
      }
    },
    {
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
    },
    {
      name: 'multi-menu',
      path: '/multi-menu',
      component: 'basic',
      children: [
        {
          name: 'multi-menu_first',
          path: '/multi-menu/first',
          component: 'multi',
          children: [
            {
              name: 'multi-menu_first_second',
              path: '/multi-menu/first/second',
              component: 'self',
              meta: {
                title: '二级菜单',
                requiresAuth: true,
                icon: 'ic:outline-menu'
              }
            },
            {
              name: 'multi-menu_first_second-new',
              path: '/multi-menu/first/second-new',
              component: 'multi',
              children: [
                {
                  name: 'multi-menu_first_second-new_third',
                  path: '/multi-menu/first/second-new/third',
                  component: 'self',
                  meta: {
                    title: '三级菜单',
                    requiresAuth: true,
                    icon: 'ic:outline-menu'
                  }
                }
              ],
              meta: {
                title: '二级菜单(有子菜单)',
                icon: 'ic:outline-menu'
              }
            }
          ],
          meta: {
            title: '一级菜单',
            icon: 'ic:outline-menu'
          }
        }
      ],
      meta: {
        title: '多级菜单',
        icon: 'carbon:menu',
        order: 8
      }
    },
    {
      name: 'management',
      path: '/management',
      component: 'basic',
      children: [
        {
          name: 'management_auth',
          path: '/management/auth',
          component: 'self',
          meta: {
            title: '权限管理',
            requiresAuth: true,
            icon: 'ic:baseline-security'
          }
        },
        {
          name: 'management_role',
          path: '/management/role',
          component: 'self',
          meta: {
            title: '角色管理',
            requiresAuth: true,
            icon: 'carbon:user-role'
          }
        },
        {
          name: 'management_user',
          path: '/management/user',
          component: 'self',
          meta: {
            title: '用户管理',
            requiresAuth: true,
            icon: 'ic:round-manage-accounts'
          }
        },
        {
          name: 'management_route',
          path: '/management/route',
          component: 'self',
          meta: {
            title: '路由管理',
            requiresAuth: true,
            icon: 'material-symbols:route'
          }
        }
      ],
      meta: {
        title: '系统管理',
        icon: 'carbon:cloud-service-management',
        order: 9
      }
    },
    {
      name: 'about',
      path: '/about',
      component: 'self',
      meta: {
        title: '关于',
        requiresAuth: true,
        singleLayout: 'basic',
        icon: 'fluent:book-information-24-regular',
        order: 10
      }
    }
  ],
  user: [
    {
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
            icon: 'icon-park-outline:analysis'
          }
        }
      ],
      meta: {
        title: '仪表盘',
        icon: 'carbon:dashboard',
        order: 1
      }
    },
    {
      name: 'auth-demo',
      path: '/auth-demo',
      component: 'basic',
      children: [
        {
          name: 'auth-demo_permission',
          path: '/auth-demo/permission',
          component: 'self',
          meta: {
            title: '权限切换',
            requiresAuth: true,
            icon: 'ic:round-construction'
          }
        }
      ],
      meta: {
        title: '权限示例',
        icon: 'ic:baseline-security',
        order: 5
      }
    },
    {
      name: 'multi-menu',
      path: '/multi-menu',
      component: 'basic',
      children: [
        {
          name: 'multi-menu_first',
          path: '/multi-menu/first',
          component: 'multi',
          children: [
            {
              name: 'multi-menu_first_second',
              path: '/multi-menu/first/second',
              component: 'self',
              meta: {
                title: '二级菜单',
                requiresAuth: true,
                icon: 'ic:outline-menu'
              }
            },
            {
              name: 'multi-menu_first_second-new',
              path: '/multi-menu/first/second-new',
              component: 'multi',
              children: [
                {
                  name: 'multi-menu_first_second-new_third',
                  path: '/multi-menu/first/second-new/third',
                  component: 'self',
                  meta: {
                    title: '三级菜单',
                    requiresAuth: true,
                    icon: 'ic:outline-menu'
                  }
                }
              ],
              meta: {
                title: '二级菜单(有子菜单)',
                icon: 'ic:outline-menu'
              }
            }
          ],
          meta: {
            title: '一级菜单',
            icon: 'ic:outline-menu'
          }
        }
      ],
      meta: {
        title: '多级菜单',
        icon: 'carbon:menu',
        order: 7
      }
    },
    {
      name: 'about',
      path: '/about',
      component: 'self',
      meta: {
        title: '关于',
        requiresAuth: true,
        singleLayout: 'basic',
        icon: 'fluent:book-information-24-regular',
        order: 8
      }
    }
  ]
};
