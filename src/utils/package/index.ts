import type { VersionInfo } from '@/interface';
import packageJson from '../../../package.json';

interface Version {
  dependencies: {
    [key: string]: string;
  };
  devDependencies: {
    [key: string]: string;
  };
  [key: string]: any;
}

interface PackageVersion {
  dependencies: VersionInfo[];
  devDependencies: VersionInfo[];
}

const versionWithType = packageJson as Version;

function transformVersionData(tuple: [string, string]): VersionInfo {
  const [name, version] = tuple;
  return {
    name,
    version
  };
}

export const packageVersion: PackageVersion = {
  dependencies: Object.entries(versionWithType.dependencies).map(item => transformVersionData(item)),
  devDependencies: Object.entries(versionWithType.devDependencies).map(item => transformVersionData(item))
};
