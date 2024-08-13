import { bgRed, green, red, yellow } from 'kolorist';

export type Lang = 'zh-cn' | 'en-us';

export const locales = {
  'zh-cn': {
    gitCommitMessages: {
      types: '请选择提交类型',
      scopes: '请选择提交范围',
      description: `请输入描述信息（${yellow('!')}开头表示破坏性改动`
    },
    gitCommitTypes: [
      ['feat', '新功能'],
      ['fix', '修复Bug'],
      ['docs', '只涉及文档更新'],
      ['style', '修改代码风格，不影响代码含义的变更'],
      ['refactor', '代码重构，既不修复 bug 也不添加功能的代码变更'],
      ['perf', '可提高性能的代码更改'],
      ['optimize', '优化代码质量的代码更改'],
      ['test', '添加缺失的测试或更正现有测试'],
      ['build', '影响构建系统或外部依赖项的更改'],
      ['ci', '对 CI 配置文件和脚本的更改'],
      ['chore', '没有修改src或测试文件的其他变更'],
      ['revert', '还原先前的提交']
    ] as [string, string][],
    gitCommitScopes: [
      ['projects', '项目'],
      ['packages', '包'],
      ['components', '组件'],
      ['hooks', '钩子函数'],
      ['utils', '工具函数'],
      ['types', 'TS类型声明'],
      ['styles', '代码风格'],
      ['deps', '项目依赖'],
      ['release', '发布项目新版本'],
      ['other', '其他的变更']
    ] as [string, string][],
    gitCommitVerify: `${bgRed(' 错误 ')} ${red('git 提交信息必须符合 Conventional Commits 标准!')}\n\n${green(
      '推荐使用命令 `pnpm commit` 生成符合 Conventional Commits 标准的提交信息。\n获取有关 Conventional Commits 的更多信息，请访问此链接: https://conventionalcommits.org'
    )}`
  },
  'en-us': {
    gitCommitMessages: {
      types: 'Please select a type',
      scopes: 'Please select a scope',
      description: `Please enter a description (add prefix ${yellow('!')} to indicate breaking change)`
    },
    gitCommitTypes: [
      ['feat', 'A new feature'],
      ['fix', 'A bug fix'],
      ['docs', 'Documentation only changes'],
      ['style', 'Changes that do not affect the meaning of the code'],
      ['refactor', 'A code change that neither fixes a bug nor adds a feature'],
      ['perf', 'A code change that improves performance'],
      ['optimize', 'A code change that optimizes code quality'],
      ['test', 'Adding missing tests or correcting existing tests'],
      ['build', 'Changes that affect the build system or external dependencies'],
      ['ci', 'Changes to our CI configuration files and scripts'],
      ['chore', "Other changes that don't modify src or test files"],
      ['revert', 'Reverts a previous commit']
    ] as [string, string][],
    gitCommitScopes: [
      ['projects', 'project'],
      ['packages', 'packages'],
      ['components', 'components'],
      ['hooks', 'hook functions'],
      ['utils', 'utils functions'],
      ['types', 'TS declaration'],
      ['styles', 'style'],
      ['deps', 'project dependencies'],
      ['release', 'release project'],
      ['other', 'other changes']
    ] as [string, string][],
    gitCommitVerify: `${bgRed(' ERROR ')} ${red('git commit message must match the Conventional Commits standard!')}\n\n${green(
      'Recommended to use the command `pnpm commit` to generate Conventional Commits compliant commit information.\nGet more info about Conventional Commits, follow this link: https://conventionalcommits.org'
    )}`
  }
} satisfies Record<Lang, Record<string, unknown>>;
