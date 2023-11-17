import { rimraf } from 'rimraf';

export async function cleanup(paths: string[]) {
  await rimraf(paths, { glob: true });
}
