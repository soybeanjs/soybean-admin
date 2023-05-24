import type { LocaleMessages } from 'vue-i18n';

const locale: LocaleMessages<I18nType.Schema> = {
  message: {
    system: {
      title: 'SoybeanAdmin'
    },
    routes: {
      dashboard: {
        _value: 'Dashboard',
        analysis: 'Analysis',
        workbench: 'Workbench'
      },
      document: {
        _value: 'Document',
        vue: 'Vue Document',
        vite: 'Vite Document',
        naive: 'NaiveUI Document',
        project: 'Project Document',
        'project-link': 'Project Document(href)'
      },
      component: {
        _value: 'Component',
        button: 'Button',
        card: 'Card',
        table: 'Table'
      },
      plugin: {
        _value: 'Plugin',
        charts: {
          _value: 'Chart',
          echarts: 'ECharts',
          antv: 'AntV'
        },
        copy: 'Copy',
        editor: {
          _value: 'Editor',
          quill: 'Quill',
          markdown: 'Markdown'
        },
        icon: 'Icon',
        map: 'Map',
        print: 'Print',
        swiper: 'Swiper',
        video: 'Video'
      },
      'auth-demo': {
        _value: 'Auth Demo',
        permission: 'Toggle Permission',
        super: 'Super Auth'
      },
      function: {
        _value: 'Function',
        tab: 'System Tab'
      },
      exception: {
        _value: 'Exception',
        403: '403',
        404: '404',
        500: '500'
      },
      'multi-menu': {
        _value: 'Multi Degree Menu',
        first: {
          _value: 'First Degree',
          second: 'Second Degree',
          'second-new': {
            _value: 'Second Degree With Children',
            third: 'Third Degree'
          }
        }
      },
      management: {
        _value: 'System Management',
        auth: 'Auth',
        role: 'Role',
        route: 'Route',
        user: 'User'
      },
      about: 'About'
    }
  }
};

export default locale;
