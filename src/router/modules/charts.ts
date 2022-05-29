const charts: AuthRoute.Route = {
  name: 'plugin_charts',
  path: '/plugin/charts',
  component: 'multi',
  children: [
    {
      name: 'plugin_charts_echarts',
      path: '/plugin/charts/echarts',
      component: 'self',
      meta: {
        title: 'ECharts',
        requiresAuth: true,
        icon: 'simple-icons:apacheecharts'
      }
    },
    {
      name: 'plugin_charts_d3',
      path: '/plugin/charts/d3',
      component: 'self',
      meta: {
        title: 'D3',
        requiresAuth: true,
        icon: 'simple-icons:d3dotjs'
      }
    },
    {
      name: 'plugin_charts_antv',
      path: '/plugin/charts/antv',
      component: 'self',
      meta: {
        title: 'AntV',
        requiresAuth: true,
        icon: 'ant-design:bar-chart-outlined'
      }
    }
  ],
  meta: {
    title: '图表',
    icon: 'material-symbols:bar-chart-rounded'
  }
};

export default charts;
