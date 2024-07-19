import type { ChangelogOption } from '@soybeanjs/changelog';

export interface CliOption {
  /** The project root directory */
  cwd: string;
  /**
   * Cleanup dirs
   *
   * Glob pattern syntax {@link https://github.com/isaacs/minimatch}
   *
   * @default
   * ```json
   * ["** /dist", "** /pnpm-lock.yaml", "** /node_modules", "!node_modules/**"]
   * ```
   */
  cleanupDirs: string[];
  /**
   * Npm-check-updates command args
   *
   * @default ['--deep', '-u']
   */
  ncuCommandArgs: string[];
  /**
   * Options of generate changelog
   *
   * @link https://github.com/soybeanjs/changelog
   */
  changelogOptions: Partial<ChangelogOption>;
  /** The ignore pattern list of git commit verify */
  gitCommitVerifyIgnores: RegExp[];
}
