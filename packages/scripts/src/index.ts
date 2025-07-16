import cac from 'cac';
import { blue, lightGreen } from 'kolorist';
import { version } from '../package.json';
import { cleanup, genChangelog, generateRoute, gitCommit, gitCommitVerify, release, updatePkg } from './commands';
import { loadCliOptions } from './config';
import type { Lang } from './locales';

type Command = 'cleanup' | 'update-pkg' | 'git-commit' | 'git-commit-verify' | 'changelog' | 'release' | 'gen-route';

type CommandAction<A extends object> = (args?: A) => Promise<void> | void;

type CommandWithAction<A extends object = object> = Record<Command, { desc: string; action: CommandAction<A> }>;

interface CommandArg {
  /** bump 版本并 git commit 之前执行的额外命令，默认为 'pnpm sa changelog' */
  execute?: string;
  /** 是否推送 git commit 和 tag，默认为 true */
  push?: boolean;
  /** 是否根据所有 tag 生成 changelog */
  total?: boolean;
  /**
   * 需要清理的目录的 glob 模式
   *
   * 如果未设置，则使用默认值
   *
   * 多个值用 "," 分隔
   */
  cleanupDir?: string;
  /**
   * CLI 显示语言
   *
   * @default 'en-us'
   */
  lang?: Lang;
}

export async function setupCli() {
  const cliOptions = await loadCliOptions();

  const cli = cac(blue('soybean-admin'));

  cli
    .version(lightGreen(version))
    .option('-e, --execute [command]', "bump 版本并 git commit 之前执行的额外命令，默认为 'npx soy changelog'")
    .option('-p, --push', '是否推送 git commit 和 tag')
    .option('-t, --total', '是否根据所有 tag 生成 changelog')
    .option('-c, --cleanupDir <dir>', '需要清理的目录的 glob 模式，未设置则使用默认值，多个值用 "," 分隔')
    .option('-l, --lang <lang>', 'CLI 显示语言', { default: 'en-us', type: [String] })
    .help();

  const commands: CommandWithAction<CommandArg> = {
    cleanup: {
      desc: '删除 node_modules、dist 等目录',
      action: async () => {
        await cleanup(cliOptions.cleanupDirs);
      }
    },
    'update-pkg': {
      desc: '更新 package.json 依赖版本',
      action: async () => {
        await updatePkg(cliOptions.ncuCommandArgs);
      }
    },
    'git-commit': {
      desc: 'git commit，生成符合 Conventional Commits 规范的提交信息',
      action: async args => {
        await gitCommit(args?.lang);
      }
    },
    'git-commit-verify': {
      desc: '校验 git commit 信息，确保符合 Conventional Commits 规范',
      action: async args => {
        await gitCommitVerify(args?.lang, cliOptions.gitCommitVerifyIgnores);
      }
    },
    changelog: {
      desc: '生成 changelog',
      action: async args => {
        await genChangelog(cliOptions.changelogOptions, args?.total);
      }
    },
    release: {
      desc: '发布：更新版本、生成 changelog、提交代码',
      action: async args => {
        await release(args?.execute, args?.push);
      }
    },
    'gen-route': {
      desc: '生成路由',
      action: async () => {
        await generateRoute();
      }
    }
  };

  for (const [command, { desc, action }] of Object.entries(commands)) {
    cli.command(command, lightGreen(desc)).action(action);
  }

  cli.parse();
}

setupCli();
