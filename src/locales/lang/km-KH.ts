const locale: I18nType.Schema = {
  system: {
    title: 'ប្រព័ន្ធគ្រប់គ្រង'
  },
  common: {
    add: 'បន្ថែម',
    addSuccess: 'បន្ថែមជោគជ័យ',
    edit: 'កែប្រែ',
    editSuccess: 'កែប្រែជោគជ័យ',
    delete: 'លុប',
    deleteSuccess: 'លុបជោគជ័យ',
    batchDelete: 'លុបច្រើន',
    confirm: 'យល់ព្រម',
    cancel: 'បោះបង់',
    pleaseCheckValue: 'សូមពិនិត្យមើលតម្លៃដែលបានបញ្ចូលដើម្បីបញ្ជាក់ថាត្រូវប្រើប្រាស់បាន',
    action: 'សកម្មភាព'
  },
  routes: {
    dashboard: {
      _value: 'ផ្ទាំងទិន្នន័យ',
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
  },
  layout: {
    settingDrawer: {
      title: 'ការកំណត់ស្បែក',
      themeModeTitle: 'ស្បែករបស់របស់អ្នក',
      darkMode: 'របៀបងារស្បែកងងឹត',
      layoutModelTitle: 'របៀបប្រើប្រាស់របស់អ្នក',
      systemThemeTitle: 'ស្បែករបស់ប្រព័ន្ធគ្រប់គ្រង',
      pageFunctionsTitle: 'មុខងារទំនាក់ទំនងរបស់ទំព័រ',
      pageViewTitle: 'ទំព័រទស្សន៍ទាយ',
      followSystemTheme: 'តាមដានស្បែកប្រព័ន្ធគ្រប់គ្រង',
      isCustomizeDarkModeTransition: 'ប្រើប្រាស់របៀបងារស្បែកងងឹតផ្ទាល់ខ្លួន',
      scrollMode: 'របៀបរុករក',
      scrollModeList: {
        wrapper: 'រុករកជាក់លាក់',
        content: 'រុករកមានមុខងារ'
      },
      fixedHeaderAndTab: 'បិទការរុករកជាក់លាក់និងរុករកមានមុខងារ',
      header: {
        inverted: 'បង្កើតការរុករកជាក់លាក់',
        height: 'កម្ពស់',
        crumb: {
          visible: 'បង្ហាញរុករកជាក់លាក់',
          icon: 'រុករកជាក់លាក់រូបតំណាង'
        }
      },
      tab: {
        visible: 'បង្ហាញរុករកជាក់លាក់',
        height: 'កម្ពស់',
        modeList: {
          mode: 'របៀប',
          chrome: 'ក្រុមហ៊ុន',
          button: 'ប៊ូតុង'
        },
        isCache: 'រក្សាទុកការរុករកជាក់លាក់'
      },
      sider: {
        inverted: 'បង្កើតការរុករកជាក់លាក់',
        width: 'ទទឹង',
        mixWidth: 'ទទឹងបញ្ចូល'
      },
      menu: {
        horizontalPosition: 'ទីតាំងផ្ដេក',
        horizontalPositionList: {
          flexStart: 'ចាប់ផ្ដើមឈុត',
          center: 'កណ្តាល',
          flexEnd: 'ចាប់ផ្ដើមចុងក្រោយ'
        }
      },
      footer: {
        inverted: 'បង្កើតការរុករកជាក់លាក់',
        visible: 'បង្ហាញការរុករកជាក់លាក់',
        fixed: 'ការរុករកជាក់លាក់',
        right: 'ត្រឡប់ទៅស្តាំ'
      },
      page: {
        animate: 'ការផ្លាស់ប្តូរ',
        animateMode: 'របៀបផ្លាស់ប្តូរ',
        animateModeList: {
          zoomFade: 'ពង្រីកបង្ហាញនិងលាស់ប្តូរ',
          zoomOut: 'ពង្រីកបង្ហាញនិងលាស់ប្តូរ',
          fadeSlide: 'ពង្រីកបង្ហាញនិងលាស់ប្តូរ',
          fade: 'ពង្រីកបង្ហាញនិងលាស់ប្តូរ',
          fadeBottom: 'ពង្រីកបង្ហាញនិងលាស់ប្តូរ',
          fadeScale: 'ពង្រីកបង្ហាញនិងលាស់ប្តូរ'
        }
      },
      systemTheme: {
        moreColors: 'ពន្លឺច្រើនទៀត'
      },
      themeConfiguration: {
        title: 'ការកំណត់ស្បែក',
        copy: 'ចម្លង',
        reset: 'កំណត់ឡើងវិញ',
        resetSuccess: 'កំណត់ឡើងវិញជោគជ័យ, សូមចម្លងឯកសារស្បែកឡើងវិញ!',
        operateSuccess: 'សម្រាប់ការប្រើប្រាស់ជោគជ័យ',
        copySuccess: 'ចម្លងជោគជ័យ, សូមជោគជ័យឯកសារ src/settings/theme.json!',
        confirmCopy: 'យល់ព្រម'
      }
    }
  },
  page: {
    login: {
      common: {
        userNamePlaceholder: 'ឈ្មោះអ្នកប្រើប្រាស់',
        phonePlaceholder: 'លេខទូរស័ព្ទ',
        codePlaceholder: 'លេខកូដ',
        passwordPlaceholder: 'លេខសម្ងាត់',
        confirmPasswordPlaceholder: 'បញ្ជាក់លេខសម្ងាត់',
        codeLogin: 'ចូលតាមលេខកូដ',
        confirm: 'យល់ព្រម',
        back: 'ត្រឡប់ក្រោយ',
        validateSuccess: 'បញ្ជាក់ជោគជ័យ',
        loginSuccess: 'ចូលជោគជ័យ',
        welcomeBack: 'សូមស្វាគមន៍ម្តងទៀត, {userName}!'
      },
      pwdLogin: {
        title: 'ចូលគណនី',
        rememberMe: 'ចងចាំខ្ញុំ',
        forgetPassword: 'ភ្លេចលេខសម្ងាត់',
        register: 'ចុះឈ្មោះ',
        otherAccountLogin: 'ចូលតាមគណនីផ្សេងទៀត',
        otherLoginMode: 'របៀបចូលគណនីផ្សេងទៀត',
        superAdmin: 'អ្នកគ្រប់គ្រងសុវត្ថិភាព',
        admin: 'អ្នកគ្រប់គ្រង',
        user: 'អ្នកប្រើប្រាស់'
      },
      codeLogin: {
        title: 'ចូលតាមលេខកូដ',
        getCode: 'ទទួលលេខកូដ',
        imageCodePlaceholder: 'លេខកូដរូបភាព'
      },
      register: {
        title: 'ចុះឈ្មោះ',
        agreement: 'យល់ព្រមនឹង',
        protocol: 'សម្រាប់ការប្រើប្រាស់',
        policy: 'គោលការណ៍ផ្សេងៗ'
      },
      resetPwd: {
        title: 'កំណត់លេខសម្ងាត់ថ្មី'
      },
      bindWeChat: {
        title: 'ភ្ជាប់គណនីរបស់អ្នកជាមួយគណនីរបស់អ្នក'
      }
    }
  }
};

export default locale;
