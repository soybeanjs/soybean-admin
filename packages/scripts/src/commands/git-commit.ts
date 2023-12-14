import path from 'node:path';
import { readFileSync } from 'node:fs';
import enquirer from 'enquirer';
import { bgRed, green, red } from 'kolorist';
import { execCommand } from '../shared';
import type { CliOption } from '../types';

interface PromptObject {
  types: string;
  scopes: string;
  description: string;
}

export async function gitCommit(
  gitCommitTypes: CliOption['gitCommitTypes'],
  gitCommitScopes: CliOption['gitCommitScopes']
) {
  const typesChoices = gitCommitTypes.map(([name, title]) => {
    const nameWithSuffix = `${name}:`;

    const message = `${nameWithSuffix.padEnd(12)}${title}`;

    return {
      name,
      message
    };
  });

  const scopesChoices = gitCommitScopes.map(([name, title]) => ({
    name,
    message: `${name.padEnd(30)} (${title})`
  }));

  const result = await enquirer.prompt<PromptObject>([
    {
      name: 'types',
      type: 'select',
      message: 'Please select a type',
      choices: typesChoices
    },
    {
      name: 'scopes',
      type: 'select',
      message: 'Please select a scope',
      choices: scopesChoices
    },
    {
      name: 'description',
      type: 'text',
      message: 'Please enter a description'
    }
  ]);

  const commitMsg = `${result.types}(${result.scopes}): ${result.description}`;

  await execCommand('git', ['commit', '-m', commitMsg], { stdio: 'inherit' });
}

export async function gitCommitVerify() {
  const gitPath = await execCommand('git', ['rev-parse', '--show-toplevel']);

  const gitMsgPath = path.join(gitPath, '.git', 'COMMIT_EDITMSG');

  const commitMsg = readFileSync(gitMsgPath, 'utf8').trim();

  const REG_EXP = /(?<type>[a-z]+)(\((?<scope>.+)\))?(?<breaking>!)?: (?<description>.+)/i;

  if (!REG_EXP.test(commitMsg)) {
    throw new Error(
      `${bgRed(' ERROR ')} ${red('git commit message must match the Conventional Commits standard!')}\n\n${green(
        'Recommended to use the command `pnpm commit` to generate Conventional Commits compliant commit information.\nGet more info about Conventional Commits, follow this link: https://conventionalcommits.org'
      )}`
    );
  }
}
