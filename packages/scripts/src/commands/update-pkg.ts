import { execCommand } from '../shared';

export async function updatePkg(args: string[] = ['--deep', '-u']) {
  execCommand('npx', ['ncu', ...args], { stdio: 'inherit' });
}
