export interface CliOption {
  /**
   * the project root directory
   */
  cwd: string;
  /**
   * cleanup dirs
   * @default
   * ```json
   * ["** /dist", "** /pnpm-lock.yaml", "** /node_modules", "!node_modules/**"]
   * ```
   * @description glob pattern syntax {@link https://github.com/isaacs/minimatch}
   */
  cleanupDirs: string[];
  /**
   * git commit types
   */
  gitCommitTypes: [string, string][];
  /**
   * git commit scopes
   */
  gitCommitScopes: [string, string][];
  /**
   * npm-check-updates command args
   * @default ["--deep","-u"]
   */
  ncuCommandArgs: string[];
  /**
   * prettier write glob
   * @description glob pattern syntax {@link https://github.com/micromatch/micromatch}
   */
  prettierWriteGlob: string[];
  /**
   * lint-staged config
   */
  lintStagedConfig: Record<string, string | string[]>;
}
