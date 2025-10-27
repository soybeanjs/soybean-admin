import { execCommand } from '../shared';

export async function updatePkg(args: string[] = ['--deep', '-u']) {
  execCommand('npx', ['npm-check-updates', ...args], { stdio: 'inherit' });
}
