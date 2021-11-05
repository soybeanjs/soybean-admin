import type { VersionInfo } from '@/interface';
import packageJSON from '../../../package.json';

interface Package {
  name: string;
  version: string;
  dependencies: {
    [key: string]: string;
  };
  devDependencies: {
    [key: string]: string;
  };
  [key: string]: any;
}

interface PackageJson {
  name: string;
  version: string;
  dependencies: VersionInfo[];
  devDependencies: VersionInfo[];
}

const packageWithType = packageJSON as Package;

function transformVersionData(tuple: [string, string]): VersionInfo {
  const [name, version] = tuple;
  return {
    name,
    version
  };
}

export const packageJson: PackageJson = {
  name: packageWithType.name,
  version: packageWithType.version,
  dependencies: Object.entries(packageWithType.dependencies).map(item => transformVersionData(item)),
  devDependencies: Object.entries(packageWithType.devDependencies).map(item => transformVersionData(item))
};
