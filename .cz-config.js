module.exports = {
  types: [
    { value: 'init', name: 'init:     项目初始化' },
    { value: 'feat', name: 'feat:     添加新特性' },
    { value: 'fix', name: 'fix:      修复bug' },
    { value: 'docs', name: 'docs:     仅仅修改文档' },
    { value: 'style', name: 'style:    仅仅修改了空格、格式缩进、逗号等等，不改变代码逻辑' },
    { value: 'refactor', name: 'refactor: 代码重构，没有加新功能或者修复bug' },
    { value: 'perf', name: 'perf:     优化相关，比如提升性能、体验' },
    { value: 'test', name: 'test:     添加测试用例' },
    { value: 'build', name: 'build:    依赖相关的内容' },
    { value: 'ci', name: 'ci:       CI配置相关，例如对k8s，docker的配置文件的修改' },
    { value: 'chore', name: 'chore:    改变构建流程、或者增加依赖库、工具等' },
    { value: 'revert', name: 'revert:   回滚到上一个版本' }
  ],
  scopes: [
		['projects', '项目搭建'],
    ['components', '组件相关'],
    ['hooks', 'hook 相关'],
    ['utils', 'utils 相关'],
    ['types', 'ts类型相关'],
    ['styles', '样式相关'],
    ['deps', '项目依赖'],
    ['auth', '对 auth 修改'],
    ['other', '其他修改'],
    ['custom', '以上都不是？我要自定义']
  ].map(([value, description]) => {
    return {
      value,
      name: `${value.padEnd(30)} (${description})`
    }
  }),
  messages: {
    type: '确保本次提交遵循 Angular 规范！\n选择你要提交的类型：',
    scope: '\n选择一个 scope（可选）：',
    customScope: '请输入自定义的 scope：',
    subject: '填写简短精炼的变更描述：\n',
    body: '填写更加详细的变更描述（可选）。使用 "|" 换行：\n',
    breaking: '列举非兼容性重大的变更（可选）：\n',
    footer: '列举出所有变更的 ISSUES CLOSED（可选）。 例如: #31, #34：\n',
    confirmCommit: '确认提交？'
  },
  allowBreakingChanges: ['feat', 'fix'],
  subjectLimit: 100,
  breaklineChar: '|'
}
