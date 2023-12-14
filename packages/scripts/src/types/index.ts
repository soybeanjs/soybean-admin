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
  /** Git commit types */
  gitCommitTypes: [string, string][];
  /** Git commit scopes */
  gitCommitScopes: [string, string][];
  /**
   * Npm-check-updates command args
   *
   * @default ['--deep', '-u']
   */
  ncuCommandArgs: string[];
  /**
   * Prettier write glob
   *
   * Glob pattern syntax {@link https://github.com/micromatch/micromatch}
   */
  prettierWriteGlob: string[];
  /** Lint-staged config */
  lintStagedConfig: Record<string, string | string[]>;
}
