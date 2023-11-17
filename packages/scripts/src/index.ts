import cac from 'cac';
import { blue, lightGreen } from 'kolorist';
import { version } from '../package.json';
import { cleanup, updatePkg, gitCommit, gitCommitVerify, prettierWrite, execLintStaged } from './commands';
import { loadCliOptions } from './config';

type Command = 'cleanup' | 'update-pkg' | 'git-commit' | 'git-commit-verify' | 'prettier-write' | 'lint-staged';

type CommandAction<A extends object> = (args?: A) => Promise<void> | void;

type CommandWithAction<A extends object = object> = Record<Command, { desc: string; action: CommandAction<A> }>;

interface CommandArg {
  total?: boolean;
}

export async function setupCli() {
  const cliOptions = await loadCliOptions();

  const cli = cac(blue('soybean'));

  cli.version(lightGreen(version)).help();

  const commands: CommandWithAction<CommandArg> = {
    cleanup: {
      desc: 'delete dirs: node_modules, dist, etc.',
      action: async () => {
        await cleanup(cliOptions.cleanupDirs);
      }
    },
    'update-pkg': {
      desc: 'update package.json dependencies versions',
      action: async () => {
        await updatePkg(cliOptions.ncuCommandArgs);
      }
    },
    'git-commit': {
      desc: 'git commit, generate commit message which match Conventional Commits standard',
      action: async () => {
        await gitCommit(cliOptions.gitCommitTypes, cliOptions.gitCommitScopes);
      }
    },
    'git-commit-verify': {
      desc: 'verify git commit message, make sure it match Conventional Commits standard',
      action: async () => {
        await gitCommitVerify();
      }
    },
    'prettier-write': {
      desc: 'run prettier --write',
      action: async () => {
        await prettierWrite(cliOptions.prettierWriteGlob);
      }
    },
    'lint-staged': {
      desc: 'run lint-staged',
      action: async () => {
        await execLintStaged(cliOptions.lintStagedConfig);
      }
    }
  };

  for (const [command, { desc, action }] of Object.entries(commands)) {
    cli.command(command, lightGreen(desc)).action(action);
  }

  cli.parse();
}

setupCli();
