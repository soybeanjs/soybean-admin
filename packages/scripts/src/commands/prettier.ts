import { execCommand } from '../shared';

export async function prettierWrite(writeGlob: string[]) {
  await execCommand('npx', ['prettier', '--write', '.', ...writeGlob], {
    stdio: 'inherit'
  });
}
