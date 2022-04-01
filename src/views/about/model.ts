import pkg from '~/package.json';

/** npm依赖包版本信息 */
export interface PkgVersionInfo {
  name: string;
  version: string;
}

interface Package {
  name: string;
  version: string;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  [key: string]: any;
}

interface PkgJson {
  name: string;
  version: string;
  dependencies: PkgVersionInfo[];
  devDependencies: PkgVersionInfo[];
}

const pkgWithType = pkg as Package;

function transformVersionData(tuple: [string, string]): PkgVersionInfo {
  const [name, version] = tuple;
  return {
    name,
    version
  };
}

export const pkgJson: PkgJson = {
  name: pkgWithType.name,
  version: pkgWithType.version,
  dependencies: Object.entries(pkgWithType.dependencies).map(item => transformVersionData(item)),
  devDependencies: Object.entries(pkgWithType.devDependencies).map(item => transformVersionData(item))
};
