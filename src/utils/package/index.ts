import type { VersionInfo } from '@/interface';
import version from './version.json';

interface Version {
  dependencies: {
    [key: string]: string;
  };
  devDependencies: {
    [key: string]: string;
  };
}

interface PackageVersion {
  dependencies: VersionInfo[];
  devDependencies: VersionInfo[];
}

const versionWithType = version as Version;

function transformVersionData(tuple: [string, string]): VersionInfo {
  const [name, version] = tuple;
  return {
    name,
    version
  };
}

export const packageVersion: PackageVersion = {
  dependencies: Object.entries(versionWithType.dependencies).map(item => transformVersionData(item)),
  devDependencies: Object.entries(versionWithType.dependencies).map(item => transformVersionData(item))
};
