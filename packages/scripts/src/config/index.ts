import process from 'node:process';
import { loadConfig } from 'c12';
import type { CliOption } from '../types';

const defaultOptions: CliOption = {
  cwd: process.cwd(),
  cleanupDirs: [
    '**/dist',
    '**/package-lock.json',
    '**/yarn.lock',
    '**/pnpm-lock.yaml',
    '**/node_modules',
    '!node_modules/**'
  ],
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
  ],
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
  ],
  ncuCommandArgs: ['--deep', '-u'],
  changelogOptions: {}
};

export async function loadCliOptions(overrides?: Partial<CliOption>, cwd = process.cwd()) {
  const { config } = await loadConfig<Partial<CliOption>>({
    name: 'soybean',
    defaults: defaultOptions,
    overrides,
    cwd,
    packageJson: true
  });

  return config as CliOption;
}
