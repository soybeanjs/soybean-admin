## Coding standards

- **TypeScript** — obey the `typescript-functional-style` skill for every `**/*.{ts,tsx,js,jsx}` file. Read `~/.agents/skills/typescript-functional-style/SKILL.md` before writing code.
- **Vue SFC** — obey the `vue-sfc-structure` skill for every `**/*.vue` file. Read `~/.agents/skills/vue-sfc-structure/SKILL.md` before writing code.

These rules are mandatory: read the skill instead of guessing the convention, and follow it even for small edits.

## Commits

- **Conventional Commits.** Format: `<type>(<scope>): <subject>`, with the subject in the imperative mood. **Both type and scope are required** — never omit the scope. Use one of the scopes this repo actually accepts: `projects`, `packages`, `components`, `hooks`, `utils`, `types`, `styles`, `deps`, `release`, `other`. The authoritative list of scopes and types is `gitCommitScopes` / `gitCommitTypes` in `packages/scripts/src/locales/index.ts`.
- Allowed types: `feat`, `feat-wip`, `fix`, `docs`, `typo`, `style`, `refactor`, `perf`, `optimize`, `test`, `build`, `ci`, `chore`, `revert`.
- **English is the default.** Write the subject, body, and any `BREAKING CHANGE:` footer in English. The repo does carry a `pnpm commit:zh` (`pnpm sa git-commit -l=zh-cn`) prompt and a handful of historical Chinese subjects, so Chinese is allowed when intentional — it is just not the norm, and most history is English.
- Keep the subject under 72 characters; explain the _why_ in the body, wrapped at 72 columns.
- Generate a compliant message with `pnpm commit` (or `pnpm commit:zh`). `pnpm sa git-commit-verify` checks an existing message against the format.
