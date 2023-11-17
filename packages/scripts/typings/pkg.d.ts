declare module 'lint-staged' {
  interface LintStagedOptions {
    config?: Record<string, string | string[]>;
    allowEmpty?: boolean;
  }

  type LintStagedFn = (options: LintStagedOptions) => Promise<boolean>;
  interface LintStaged extends LintStagedFn {
    default: LintStagedFn;
  }

  const lintStaged: LintStaged;

  export default lintStaged;
}
