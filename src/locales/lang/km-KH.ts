import type { LocaleMessages } from 'vue-i18n';

const locale: LocaleMessages<I18nType.Schema> = {
  message: {
    system: {
      title: 'ប្រព័ន្ធគ្រប់គ្រង'
    },
    routes: {
      dashboard: {
        dashboard: 'ផ្ទាំងទិន្នន័យ',
        analysis: 'ផ្ទាំងវិភាគ',
        workbench: 'ផ្ទាំងការងារ'
      },
      document: {
        _value: 'ឯកសារ',
        vue: 'ឯកសារ​ Vue',
        vite: 'ឯកសារ​ Vite',
        naive: 'ឯកសារ NaiveUI',
        project: 'ឯកសារគម្រោង',
        'project-link': 'ឯកសារគម្រោង(href)'
      },
      component: {
        _value: 'សមាស​ភាគ',
        button: 'ប៊ូតុង',
        card: 'កាត',
        table: 'តារាង'
      },
      plugin: {
        _value: 'មុខងារជំនួយ',
        charts: {
          _value: 'តារាង​ Chart',
          echarts: 'តារាង ECharts',
          antv: 'AntV'
        },
        copy: 'ចម្លង',
        editor: {
          _value: 'កែប្រែ',
          quill: 'Quill',
          markdown: 'Markdown'
        },
        icon: 'អាយខន',
        map: 'ផែនទី',
        print: 'បោះពុម្ភ',
        swiper: 'Swiper',
        video: 'វីដេអូ'
      },
      'auth-demo': {
        _value: 'ឌីមូ Auth',
        permission: 'បិទ/បើកការអនុញ្ញាត',
        super: 'Super Auth'
      },
      function: {
        _value: 'មុខងារ',
        tab: 'ថេបប្រព័ន្ធ'
      },
      exception: {
        _value: 'ករណីពិេសស',
        403: '403',
        404: '404',
        500: '500'
      },
      'multi-menu': {
        _value: 'ម៉ឺនុយពហុដឺក្រេ',
        first: {
          _value: 'ដឺក្រេទី១',
          second: 'ដែក្រេទី២',
          'second-new': {
            _value: 'ដឺក្រេទី២មានអនុក្រោម',
            third: 'ដឺក្រេទី៣'
          }
        }
      },
      management: {
        _value: 'ការគ្រប់គ្រងប្រព័ន្ធ',
        auth: 'Auth',
        role: 'សិទ្ធី',
        route: 'ផ្លូវប្រព័ន្ធ',
        user: 'អ្នកប្រើប្រាស់'
      },
      about: 'អំពីប្រព័ន្ធ'
    }
  }
};

export default locale;
