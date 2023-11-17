export async function execLintStaged(config: Record<string, string | string[]>) {
  const lintStaged = (await import('lint-staged')).default;

  return lintStaged({ config, allowEmpty: true });
}
