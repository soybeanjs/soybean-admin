import { $ } from 'zx';

$`rm -rf .husky`;
$`git config core.hooksPath .git/hooks/`;
$`rm -rf .git/hooks`;
$`pnpm simple-git-hooks`;
