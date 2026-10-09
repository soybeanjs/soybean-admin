## Coding standards

- **TypeScript** — obey the `typescript-functional-style` skill for every `**/*.{ts,tsx,js,jsx}` file. Read `~/.agents/skills/typescript-functional-style/SKILL.md` before writing code.
- **Vue SFC** — obey the `vue-sfc-structure` skill for every `**/*.vue` file. Read `~/.agents/skills/vue-sfc-structure/SKILL.md` before writing code.

These rules are mandatory: read the skill instead of guessing the convention, and follow it even for small edits.

## Commits

- **Conventional Commits.** Format: `<type>(<scope>): <subject>`, with the subject in the imperative mood. **Both type and scope are required** — never omit the scope; use the area the change touches (e.g. `ubean`, `proposals`, `agents`). Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
- **Commit messages are written in English.** Subject, body, and any `BREAKING CHANGE:` footer. Never commit Chinese text.
- Keep the subject under 72 characters; explain the _why_ in the body, wrapped at 72 columns.
