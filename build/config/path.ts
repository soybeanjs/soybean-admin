import { fileURLToPath } from 'url';

/**
 * 解析路径
 * @param basePath - 基础路径
 */
export function resolvePath(rootPath: string, basePath: string) {
  const root = fileURLToPath(new URL(rootPath, basePath));
  const src = `${root}src`;

  return {
    root,
    src,
  };
}
