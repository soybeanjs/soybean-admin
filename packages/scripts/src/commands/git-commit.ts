import path from 'node:path';
import { readFileSync } from 'node:fs';
import { prompt } from 'enquirer';
import { bgRed, green, red, yellow } from 'kolorist';
import { execCommand } from '../shared';
import type { CliOption } from '../types';

interface PromptObject {
  types: string;
  scopes: string;
  description: string;
}

/**
 * Git commit with Conventional Commits standard
 *
 * @param gitCommitTypes
 * @param gitCommitScopes
 */
export async function gitCommit(
  gitCommitTypes: CliOption['gitCommitTypes'],
  gitCommitScopes: CliOption['gitCommitScopes']
) {
  const typesChoices = gitCommitTypes.map(([value, msg]) => {
    const nameWithSuffix = `${value}:`;

    const message = `${nameWithSuffix.padEnd(12)}${msg}`;

    return {
      name: value,
      message
    };
  });

  const scopesChoices = gitCommitScopes.map(([value, msg]) => ({
    name: value,
    message: `${value.padEnd(30)} (${msg})`
  }));

  const result = await prompt<PromptObject>([
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
      message: `Please enter a description (add prefix ${yellow('!')} to indicate breaking change)`
    }
  ]);

  const breaking = result.description.startsWith('!') ? '!' : '';

  const description = result.description.replace(/^!/, '').trim();

  const commitMsg = `${result.types}(${result.scopes})${breaking}: ${description}`;

  await execCommand('git', ['commit', '-m', commitMsg], { stdio: 'inherit' });
}

/** Git commit message verify */
export async function gitCommitVerify() {
  const gitPath = await execCommand('git', ['rev-parse', '--show-toplevel']);

  const gitMsgPath = path.join(gitPath, '.git', 'COMMIT_EDITMSG');

  const commitMsg = readFileSync(gitMsgPath, 'utf8').trim();

  const REG_EXP = /(?<type>[a-z]+)(?:\((?<scope>.+)\))?(?<breaking>!)?: (?<description>.+)/i;

  if (!REG_EXP.test(commitMsg)) {
    throw new Error(
      `${bgRed(' ERROR ')} ${red('git commit message must match the Conventional Commits standard!')}\n\n${green(
        'Recommended to use the command `pnpm commit` to generate Conventional Commits compliant commit information.\nGet more info about Conventional Commits, follow this link: https://conventionalcommits.org'
      )}`
    );
  }
}
