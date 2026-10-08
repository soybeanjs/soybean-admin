#!/usr/bin/env node
/**
 * `pnpm remove:i18n` —— 一键裁剪国际化（v3 §4.5「保留 `remove-i18n` 裁剪脚本」）。
 *
 * 给不需要多语言的模板用户用：把 `src/**` 里 `t('key')` / `$t('key')` 的**字面量
 * 调用**就地替换成默认语言（`src/constants/index.ts` 的 `DEFAULT_LOCALE`）文案，
 * 再拆掉 i18n 基础设施（`src/locales/`、`src/shared/vean-locale.ts`、
 * `ubean.config.ts` 的 `i18n` 段、语言切换 UI、`useI18n()` 装配）。
 *
 * 定位：**只处理可机械判定的部分**，跑完打印剩余人工项并以非 0 退出码收尾，
 * 让人工项永远可见（宁可报出来，也不要静默改错）。默认 dry-run，`--write` 才落盘。
 *
 * 处理范围：
 * 1. 字面量 `t('a.b')` → `'文案'`；带参 `t('a.b', { name })` → `` `文案：${name}` ``；
 * 2. 常量表里的 `label: 'a.b'` → 文案，并解包 `t(item.label)`（常量表把取值与
 *    展示文案放在同一条记录里，只能逐字段内联，不能整表删）；
 * 3. `*TitleKeys` 常量表（`Record<K, string>` 的 i18n key 表）→ `*Titles` 文案表，
 *    并把 `t(activeTitle)` 这类「t 包一个已翻译变量」的解包；
 * 4. 基础设施文件删除 + `app.ts` / `app.vue` / 布局 / 登录壳的定点改写（见 FILE_RULES）；
 * 5. 残留扫描：`useI18n`、动态 `t(…)`、`@/shared/vean-locale`、`setLocale` 等。
 *
 * 不处理（有意留下）：`i18nKey` / `title` 字段本身 —— 它们是数据（可来自后端菜单），
 * 去掉解析后就是普通文本字段，删字段属于业务改造，不在本脚本职责内。
 *
 * 用法：
 *   pnpm remove:i18n            # dry-run，只打印计划
 *   pnpm remove:i18n --write    # 落盘
 *   node scripts/remove-i18n.ts --root /tmp/copy --write
 */
import { existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const DEFAULT_ROOT = resolve(SCRIPT_DIR, '..');

/** 参与字面量替换的文件后缀 */
const SOURCE_EXTENSIONS = ['.vue', '.ts'];
/** 跳过：locale 文案本体、测试、构建产物 */
const SKIP_DIRECTORIES = ['node_modules', 'dist', '.git', '.ubean', 'src/locales'];
/**
 * 残留扫描的「活跃 i18n API」模式。
 *
 * 只报「引用即报错」的东西：纯数据字段（`i18nKey` / `title` / `AppLocale`）与
 * 常量表（`APP_LOCALES` / `APP_LOCALE_LABELS` / `DEFAULT_LOCALE`）不算 —— 它们
 * 删掉解析后就是普通数据，留着无害，删字段属于业务改造。
 */
const LEFTOVER_PATTERNS = [
  { label: 'useI18n', pattern: /useI18n/ },
  { label: '动态 t(...)', pattern: /(?:\$t|(?<![\w.$])t)\(\s*[^'")]/ },
  { label: '@/shared/vean-locale', pattern: /shared\/vean-locale/ },
  { label: 'setLocale', pattern: /\bsetLocale\b/ },
  { label: 'syncDocumentLocale', pattern: /syncDocumentLocale/ }
];

/** 有意保留（不报残留）：数据字段与常量表 */
const KEPT_ON_PURPOSE = [
  'i18nKey / title 字段（数据，可来自后端菜单）',
  'APP_LOCALES / APP_LOCALE_LABELS / DEFAULT_LOCALE / AppLocale（常量与类型）',
  'package.json 的 vue-i18n 依赖与 prepare / remove:i18n 脚本'
];

export interface Messages {
  /** 扁平 key → 文案（`'common.login'` → `'登录'`） */
  flat: Map<string, string>;
}

export interface InlineResult {
  code: string;
  inlined: string[];
  /** 无法机械替换的字面量调用（缺 key / 参数对不上） */
  problems: string[];
}

export interface FileRule {
  /** 相对 `--root` 的路径 */
  file: string;
  note: string;
  patterns: Array<{ find: string | RegExp; replace: string; description: string }>;
}

/** `value` 是普通对象（非数组/非 null）时才可继续下钻 */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** 把嵌套文案对象压成 `key → 文案` 的扁平表 */
export function flattenMessages(source: Record<string, unknown>, prefix = ''): Map<string, string> {
  const flat = new Map<string, string>();

  for (const [key, value] of Object.entries(source)) {
    const path = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'string') {
      flat.set(path, value);
    } else if (isRecord(value)) {
      for (const [nestedKey, nestedValue] of flattenMessages(value, path)) {
        flat.set(nestedKey, nestedValue);
      }
    }
  }

  return flat;
}

/** 文案 → TS 字面量（含引号/换行/模板占位时自动选反引号并转义） */
export function toLiteral(text: string): string {
  const hasNewline = text.includes('\n');
  const hasSingleQuote = text.includes("'");
  const hasTemplateSyntax = text.includes('`') || text.includes('${');

  if (hasNewline || hasTemplateSyntax) {
    return `\`${text.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${')}\``;
  }

  if (hasSingleQuote) {
    return `"${text.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
  }

  return `'${text.replace(/\\/g, '\\\\')}'`;
}

/** 带参调用的 `{ nickname }` / `{ nickname: value }` → 参数名列表 */
export function parseParamNames(paramsSource: string): string[] {
  return [...paramsSource.matchAll(/([A-Za-z_$][\w$]*)\s*[,:}]/g)].map(match => match[1]);
}

/** 文案里的 `{name}` 占位 → 模板字面量的 `${name}`（缺参数时返回 null） */
export function interpolate(text: string, paramNames: string[]): string | null {
  const placeholders = [...text.matchAll(/\{([\w$]+)\}/g)].map(match => match[1]);
  const missing = placeholders.filter(name => !paramNames.includes(name));

  if (missing.length > 0) return null;

  return text.replace(/\{([\w$]+)\}/g, '${$1}');
}

/**
 * 把源码里的字面量 `t('key')` / `$t('key')` 替换成文案。
 *
 * 只认字面量 key（含可解析的第二个参数对象）：动态 key（`t(meta.i18nKey)`）留给
 * `FILE_RULES` 的定点规则或人工处理 —— 机械替换猜不出运行时值。
 */
export function inlineTranslations(source: string, messages: Messages): InlineResult {
  const literalCall = /(?:\$t|(?<![\w.$])t)\(\s*(['"])([^'"]+)\1\s*(?:,\s*(\{[^}]*\}))?\s*\)/g;
  const inlined: string[] = [];
  const problems: string[] = [];

  const code = source.replace(literalCall, (match, _quote: string, key: string, paramsSource: string | undefined) => {
    const text = messages.flat.get(key);

    if (text === undefined) {
      problems.push(`${key}：${messages.flat.size > 0 ? '文案表里没有这个 key' : '未加载到文案'}`);
      return match;
    }

    const paramNames = paramsSource ? parseParamNames(paramsSource) : [];
    const rendered = paramNames.length > 0 ? interpolate(text, paramNames) : text;

    if (rendered === null) {
      problems.push(`${key}：文案占位符与调用参数不匹配（${paramsSource ?? '无参数'}）`);
      return match;
    }

    inlined.push(key);

    return toLiteral(rendered);
  });

  return { code, inlined, problems };
}

/**
 * i18n key 表 → 文案表：`const moduleTitleKeys: Record<K, string> = { a: 'x.y' }`
 * 变成 `const moduleTitles: Record<K, string> = { a: '文案' }`，并解包
 * `t(activeTitle…)`（该变量此后已经是文案，再包一层 `t()` 就错了）。
 */
export function inlineTitleKeyMaps(source: string, messages: Messages): { code: string; rewrites: string[] } {
  const rewrites: string[] = [];
  let code = source;

  const mapPattern = /const (\w+?)TitleKeys\b([^=]*)=\s*\{([\s\S]*?)\n\};/g;

  for (const match of source.matchAll(mapPattern)) {
    const [block, baseName, annotation, entries] = match;
    const parsedEntries = [...entries.matchAll(/^\s*([\w'"-]+)\s*:\s*(['"])([^'"]+)\2/gm)];
    const missing = parsedEntries.filter(entry => !messages.flat.has(entry[3]));

    if (parsedEntries.length === 0 || missing.length > 0) {
      rewrites.push(`${baseName}TitleKeys：有 key 不在文案表里，跳过（${missing.map(m => m[3]).join(', ')}）`);
      continue;
    }

    const rebuilt = parsedEntries
      .map(entry => `  ${entry[1]}: ${toLiteral(messages.flat.get(entry[3]) ?? '')}`)
      .join(',\n');
    const replacement = `const ${baseName}Titles${annotation}= {\n${rebuilt}\n};`;
    // 函数式替换：文案里可能出现 `$` 等 replace 特殊序列
    const next = code.replace(block, () => replacement);

    if (next === code && !code.includes(replacement)) {
      rewrites.push(`${baseName}TitleKeys：替换未命中，跳过`);
      continue;
    }

    code = next;
    // 声明改名后，别处的引用（如 `<base>TitleKeys[activeModule]`）也要跟上
    code = code.replace(new RegExp(`\\b${baseName}TitleKeys\\b`, 'g'), `${baseName}Titles`);
    rewrites.push(`${baseName}TitleKeys → ${baseName}Titles（${parsedEntries.length} 条文案内联）`);
  }

  // `t(activeTitleKey)` → `activeTitle`：变量名里的 `…Key` 已不成立，且不能再包 t()
  const computedPattern = /const (\w+?)TitleKey\b/g;

  for (const match of code.matchAll(computedPattern)) {
    const baseName = match[1];

    code = code.replace(new RegExp(`\\b${baseName}TitleKey\\b`, 'g'), `${baseName}Title`);
    code = code.replace(new RegExp(`\\$?t\\(\\s*${baseName}Title\\s*\\)`, 'g'), `${baseName}Title`);
    rewrites.push(`t(${baseName}TitleKey) → ${baseName}Title`);
  }

  return { code, rewrites };
}

/**
 * 常量表里的 `label: 'a.b'` → 文案。
 *
 * 选项表（主题抽屉的下拉/分段控件候选）把取值与展示文案放在同一条记录里：
 * `{ value: 'card', label: 'theme.tabVariant.card' }`。取值要留着做持久化，标签要换成
 * 文案，所以只能逐字段内联 —— 判据仍是「文案表里有这个 key」，纯数据字段
 * （`i18nKey` / `title`）不受影响。
 */
export function inlineLabelFields(source: string, messages: Messages): { code: string; inlined: string[] } {
  const inlined: string[] = [];
  const code = source.replace(
    /(\blabel\s*:\s*)(['"])([^'"\n]+)\2/g,
    (match, prefix: string, _quote: string, key: string) => {
      const text = messages.flat.get(key);

      if (text === undefined) return match;

      inlined.push(key);

      return `${prefix}${toLiteral(text)}`;
    }
  );

  return { code, inlined };
}

/**
 * `t(item.label)` → `item.label`。
 *
 * `inlineLabelFields` 之后 `label` 已经是文案，再包一层 `t()` 会把文案当 key 查
 * （vue-i18n 直接回显 key 并告警）。只解包「以 `.label` 结尾」的实参：
 * `t(node.i18nKey)` 这类真・动态 key 不在本规则职责内，由 `FILE_RULES` 定点处理。
 */
export function unwrapLabelCalls(source: string): { code: string; rewrites: string[] } {
  const rewrites: string[] = [];
  const pattern = /(?:\$t|(?<![\w.$])t)\(\s*([A-Za-z_$][\w$]*(?:\.[\w$]+)*\.label)\s*\)/g;
  const code = source.replace(pattern, (_match, expression: string) => {
    rewrites.push(`t(${expression}) → ${expression}`);

    return expression;
  });

  return { code, rewrites };
}

/** 文件里已无 `t()` 调用时，拆掉 `useI18n` 装配（import + 解构），避免未使用变量报错 */
export function stripUnusedI18nHarness(source: string): { code: string; stripped: boolean } {
  if (/(?:\$t|(?<![\w.$])t)\(/.test(stripComments(source))) return { code: source, stripped: false };

  const next = source
    .replace(/^import \{ useI18n \} from 'vue-i18n';\n/m, '')
    .replace(/^const \{[^}]*\} = useI18n\(\);\n/m, '');

  return { code: next, stripped: next !== source };
}

/** 轻量去注释（供「是否还在用 i18n」的判断用；不追求字符串内的 `//` 精确性） */
export function stripComments(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n')
    .map(line => line.replace(/(^|\s)\/\/.*$/, '$1'))
    .join('\n');
}

/** 定点改写：基础设施文件里 i18n 装配的删除/替换（本仓库约定，逐条必需命中） */
export const FILE_RULES: FileRule[] = [
  {
    file: 'ubean.config.ts',
    note: '去掉 i18n 配置段',
    patterns: [
      {
        find: /\n  i18n: \{[\s\S]*?\n  \},/,
        replace: '',
        description: '删除 defineUbean 的 i18n 配置'
      }
    ]
  },
  {
    file: 'src/app.ts',
    note: '不再注册 Vean 组件语言包',
    patterns: [
      {
        find: /\nimport \{ registerVeanLocales \} from '@\/shared\/vean-locale';/,
        replace: '',
        description: '删除 registerVeanLocales import'
      },
      {
        find: /\n\/\*\*\n \* 注册 Vean 组件内置文案的 locale key[\s\S]*?\*\/\nregisterVeanLocales\(\);\n/,
        replace: '\n',
        description: '删除 registerVeanLocales() 调用与其注释'
      }
    ]
  },
  {
    file: 'src/app.vue',
    note: '标题改读 meta.title，去掉 SConfigProvider 的 locale 与 <html lang> 同步',
    patterns: [
      { find: /\nimport \{ useI18n \} from 'vue-i18n';/, replace: '', description: '删除 vue-i18n import' },
      {
        find: /\nimport \{ syncDocumentLocale \} from '@\/shared\/i18n';/,
        replace: '',
        description: '删除 syncDocumentLocale import'
      },
      { find: 'const { t, locale } = useI18n();\n', replace: '', description: '删除 useI18n 解构' },
      {
        find: /\n\/\*\*\n \* 把应用 locale[\s\S]*?const veanLocale = computed\(\(\) => locale\.value\);\n/,
        replace: '',
        description: '删除 veanLocale 计算属性'
      },
      {
        find: "const title = (meta.i18nKey ? t(meta.i18nKey) : '') || meta.title || '';",
        replace: "const title = meta.title || '';",
        description: '标题回落 meta.title'
      },
      {
        find: /\n\/\*\*\n \* locale → `<html lang>`[\s\S]*?watch\(locale, syncDocumentLocale, \{ immediate: true \}\);\n/,
        replace: '',
        description: '删除 <html lang> 同步 watcher'
      },
      { find: ' :locale="veanLocale"', replace: '', description: 'SConfigProvider 去掉 locale' }
    ]
  },
  {
    file: 'src/components/global-search/index.vue',
    note: '菜单条目文案直接取 label（不再走 t(i18nKey) 解析）',
    patterns: [
      {
        find: 'label: item.i18nKey ? t(item.i18nKey) : item.label',
        replace: 'label: item.label',
        description: '菜单条目文案直接取 label'
      }
    ]
  },
  {
    file: 'src/layouts/default.vue',
    note: '去掉语言切换下拉与菜单/页签的 t() 解析',
    patterns: [
      {
        find: "import { APP_LOCALES, APP_LOCALE_LABELS, APP_TITLE, APP_VERSION } from '@/constants';",
        replace: "import { APP_TITLE, APP_VERSION } from '@/constants';",
        description: '常量 import 去掉语言表'
      },
      {
        find: /\nimport \{ registerVeanLocalePack \} from '@\/shared\/vean-locale';/,
        replace: '',
        description: '删除语言包注册 import'
      },
      { find: /\nimport \{ setLocale \} from 'ubean\/client';/, replace: '', description: '删除 setLocale import' },
      {
        find: 'label: node.i18nKey ? t(node.i18nKey) : node.label,',
        replace: 'label: node.label,',
        description: '菜单标签直接取 label'
      },
      {
        find: 'label: tab.i18nKey ? t(tab.i18nKey) : tab.label,',
        replace: 'label: tab.label,',
        description: '页签标签直接取 label'
      },
      {
        find: /\n\/\*\*\n \* 语言下拉项[\s\S]*?\n\}\n/m,
        replace: '\n',
        description: '删除语言下拉项/处理器'
      },
      {
        find: /\n        <SDropdownMenu :items="localeMenuItems"[\s\S]*?<\/SDropdownMenu>\n/,
        replace: '\n',
        description: '删除语言切换下拉模板'
      }
    ]
  }
];

/** 需要整目录/整文件删除的 i18n 基础设施 */
export const DELETE_PATHS = [
  'src/locales',
  'src/shared/vean-locale.ts',
  'src/shared/vean-locale.test.ts',
  'src/shared/i18n.ts',
  'src/shared/i18n.test.ts'
];

/** 递归收集 `src/**` 下参与替换的源码文件（相对 root 的路径，排序稳定） */
export function collectSourceFiles(root: string, dir = 'src'): string[] {
  const absolute = join(root, dir);

  if (!existsSync(absolute)) return [];

  const files: string[] = [];

  for (const entry of readdirSync(absolute, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const relativePath = join(dir, entry.name);

    if (entry.isDirectory()) {
      if (SKIP_DIRECTORIES.includes(relativePath) || SKIP_DIRECTORIES.includes(entry.name)) continue;
      files.push(...collectSourceFiles(root, relativePath));
      continue;
    }

    const isSource = SOURCE_EXTENSIONS.some(extension => entry.name.endsWith(extension));

    if (isSource && !entry.name.endsWith('.test.ts')) files.push(relativePath);
  }

  return files;
}

/** 扫描残留的活跃 i18n API（跳过注释；`i18nKey` 之类的数据字段不报） */
export function scanLeftovers(source: string): Array<{ label: string; line: number; text: string }> {
  const findings: Array<{ label: string; line: number; text: string }> = [];
  const lines = source.split('\n');
  let inBlockComment = false;

  lines.forEach((raw, index) => {
    const trimmed = raw.trim();

    if (inBlockComment) {
      if (trimmed.includes('*/')) inBlockComment = false;
      return;
    }

    if (trimmed.startsWith('/*')) {
      if (!trimmed.includes('*/')) inBlockComment = true;
      return;
    }

    if (trimmed.startsWith('*') || trimmed.startsWith('//')) return;

    const line = raw.replace(/(^|\s)\/\/.*$/, '$1');

    for (const { label, pattern } of LEFTOVER_PATTERNS) {
      if (pattern.test(line)) findings.push({ label, line: index + 1, text: trimmed });
    }
  });

  return findings;
}

interface Options {
  root: string;
  write: boolean;
  help: boolean;
}

export function parseOptions(argv: string[]): Options {
  const options: Options = { root: DEFAULT_ROOT, write: false, help: false };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--write') options.write = true;
    else if (arg === '--help' || arg === '-h') options.help = true;
    else if (arg === '--root') {
      index += 1;
      options.root = resolve(argv[index] ?? '.');
    }
  }

  return options;
}

/** 从 `src/constants/index.ts` 读默认语言（读不到时回落 `zh`，并提示） */
export function readDefaultLocale(root: string): { locale: string; source: string } {
  const constantsPath = join(root, 'src/constants/index.ts');

  if (!existsSync(constantsPath)) return { locale: 'zh', source: '回落默认值' };

  const match = readFileSync(constantsPath, 'utf8').match(/DEFAULT_LOCALE[^=]*=\s*'([^']+)'/);

  return match ? { locale: match[1], source: 'src/constants/index.ts' } : { locale: 'zh', source: '回落默认值' };
}

function readMessages(root: string, locale: string): Messages | null {
  const localePath = join(root, `src/locales/${locale}.json`);

  if (!existsSync(localePath)) return null;

  return { flat: flattenMessages(parseMessagesJson(readFileSync(localePath, 'utf8'))) };
}

/** 解析 locales JSON 为文案对象（非对象/解析失败时抛出，交由调用方处理） */
function parseMessagesJson(source: string): Record<string, unknown> {
  const parsed: unknown = JSON.parse(source);

  if (!isRecord(parsed)) throw new Error('locale 文案 JSON 顶层必须是对象');

  return parsed;
}

/** 一个待落盘的裁剪计划（dry-run 与 `--write` 走同一条路径，保证预览 = 结果） */
export interface RemoveI18nPlan {
  /** 相对 root 的路径 → 新内容（只含真正变化的文件） */
  files: Map<string, string>;
  /** 将被删除的相对路径 */
  deleted: string[];
  /** 内联的字面量文案条数 */
  inlined: number;
  /** 结构改写说明（key 表、t() 解包、基础设施文件） */
  rewrites: string[];
  /** 无法机械处理的问题（缺 key、规则未命中等） */
  problems: string[];
  /** 落盘后仍残留的活跃 i18n API */
  leftovers: string[];
}

/** 计算裁剪计划：只读磁盘，dry-run 与 `--write` 的唯一真相 */
export function planRemoveI18n(root: string, messages: Messages): RemoveI18nPlan {
  const content = new Map<string, string>();
  const changed = new Map<string, string>();
  const rewrites: string[] = [];
  const problems: string[] = [];
  let inlined = 0;

  const read = (file: string) => content.get(file) ?? readFileSync(join(root, file), 'utf8');

  // 1. 内联字面量 t() / $t()（含常量表 label 字段与 useI18n 装配清理）
  for (const file of collectSourceFiles(root)) {
    const original = read(file);
    const inline = inlineTranslations(original, messages);
    const labelFields = inlineLabelFields(inline.code, messages);
    const unwrapped = unwrapLabelCalls(labelFields.code);
    const titleMaps = inlineTitleKeyMaps(unwrapped.code, messages);
    const next = stripUnusedI18nHarness(titleMaps.code).code;

    content.set(file, next);
    inlined += inline.inlined.length + labelFields.inlined.length;
    problems.push(...inline.problems.map(problem => `${file}：${problem}`));
    rewrites.push(...unwrapped.rewrites.map(rewrite => `${file}：${rewrite}`));
    rewrites.push(...titleMaps.rewrites.map(rewrite => `${file}：${rewrite}`));

    if (next !== original) changed.set(file, next);
  }

  // 2. 定点改写基础设施文件
  for (const rule of FILE_RULES) {
    if (!existsSync(join(root, rule.file))) {
      problems.push(`${rule.file}：文件不存在（${rule.note}）`);
      continue;
    }

    const original = read(rule.file);
    let code = original;

    for (const { find, replace, description } of rule.patterns) {
      const before = code;
      code = code.replace(find, () => replace);

      if (code === before) problems.push(`${rule.file}：未命中「${description}」`);
    }

    content.set(rule.file, code);

    if (code === original) continue;

    changed.set(rule.file, code);
    rewrites.push(`${rule.file}：${rule.note}`);
  }

  // 3. 复查 useI18n 装配：布局的 `t(node.i18nKey)` 是在第 2 步才被去掉的，
  //    第 1 步执行时还看得到 t()，所以这里再清一次
  for (const [file, code] of content) {
    const next = stripUnusedI18nHarness(code).code;

    if (next === code) continue;

    content.set(file, next);
    changed.set(file, next);
  }

  // 4. 标记删除（已删除的路径不再参与残留扫描）
  const deleted = DELETE_PATHS.filter(target => existsSync(join(root, target)));

  for (const target of deleted) {
    // Map 迭代器容忍迭代中删除已访问的键，无需先拷贝键列表
    for (const file of content.keys()) {
      if (file === target || file.startsWith(`${target}/`)) content.delete(file);
    }

    changed.delete(target);
  }

  // 5. 残留扫描：扫「落盘后的内容」，所以 dry-run 的报数就是 --write 的结果
  const leftovers: string[] = [];

  const remaining = Array.from(content.keys()).sort((a, b) => a.localeCompare(b));

  for (const file of remaining) {
    const findings = scanLeftovers(content.get(file) ?? '');

    leftovers.push(...findings.map(finding => `${file}:${finding.line} [${finding.label}] ${finding.text}`));
  }

  return { files: changed, deleted, inlined, rewrites, problems, leftovers };
}

/** 落盘：写改动文件 + 删除基础设施路径（调用方负责写计划明细） */
export function applyRemoveI18nPlan(root: string, plan: RemoveI18nPlan): void {
  for (const [file, code] of plan.files) writeFileSync(join(root, file), code);

  for (const target of plan.deleted) rmSync(join(root, target), { recursive: true, force: true });
}

function printHelp(): void {
  process.stdout.write(
    [
      'pnpm remove:i18n —— 一键裁剪国际化（默认 dry-run）',
      '',
      '  --write          真正落盘（默认只打印计划）',
      '  --root <dir>     在指定目录上执行（默认仓库根，可指向一份副本先试跑）',
      '  -h, --help       显示帮助',
      ''
    ].join('\n')
  );
}

function main(): void {
  const options = parseOptions(process.argv.slice(2));

  if (options.help) {
    printHelp();
    return;
  }

  const { root } = options;
  const { locale, source } = readDefaultLocale(root);
  const messages = readMessages(root, locale);
  const lines: string[] = [];

  lines.push(`remove-i18n：根目录 ${root}`);
  lines.push(`默认语言 ${locale}（来源：${source}）${options.write ? '' : ' —— DRY RUN，未落盘'}`);
  lines.push('');

  if (!messages) {
    process.stdout.write(
      `✗ 找不到 src/locales/${locale}.json（可能已经裁剪过 i18n）。没有文案表无法内联字面量 t()。\n`
    );
    process.exitCode = 1;
    return;
  }

  const plan = planRemoveI18n(root, messages);

  lines.push(`文案表：${messages.flat.size} 条`);
  lines.push('', `【1/4】内联字面量 t() / $t()：命中 ${plan.files.size} 个文件，内联 ${plan.inlined} 处文案`);
  lines.push(...plan.rewrites.map(rewrite => `  · ${rewrite}`));

  lines.push('', '【2/4】i18n 基础设施');

  if (plan.deleted.length === 0) {
    lines.push('  ⊘ 没有可删除的文件（可能已裁剪）');
  } else {
    lines.push(...plan.deleted.map(target => `  ✓ 删除 ${target}${target.includes('.') ? '' : '（整目录）'}`));
  }

  lines.push('', '【3/4】残留扫描（活跃 i18n API）');

  if (plan.leftovers.length === 0) {
    lines.push('  ✓ 没有残留');
  } else {
    lines.push(...plan.leftovers.map(leftover => `  ! ${leftover}`));
  }

  lines.push('', '【4/4】落盘');

  if (options.write) {
    applyRemoveI18nPlan(root, plan);
    lines.push(`  ✓ 写入 ${plan.files.size} 个文件，删除 ${plan.deleted.length} 个路径`);
  } else {
    lines.push(`  ⊘ DRY RUN：将写入 ${plan.files.size} 个文件、删除 ${plan.deleted.length} 个路径（加 --write 生效）`);
  }

  if (plan.problems.length > 0) {
    lines.push('', '需要人工确认：', ...plan.problems.map(problem => `  ! ${problem}`));
  }

  lines.push('', '有意保留（非残留）：', ...KEPT_ON_PURPOSE.map(item => `  · ${item}`));
  lines.push(
    '',
    plan.leftovers.length === 0 && plan.problems.length === 0
      ? '完成：可以再跑 pnpm typecheck && pnpm test 验证'
      : `还有 ${plan.leftovers.length} 处残留、${plan.problems.length} 处待确认`
  );

  const planPath = join(root, 'remove-i18n.plan.txt');

  if (options.write) writeFileSync(planPath, `${lines.join('\n')}\n`);

  lines.push(`（明细${options.write ? '已写入' : '未写入（dry-run）'} ${relative(root, planPath)}）`);

  process.stdout.write(`${lines.join('\n')}\n`);

  if (plan.leftovers.length > 0 || plan.problems.length > 0) process.exitCode = 1;
}

// 供 `node scripts/remove-i18n.ts` 直接执行；被 vitest import 时不进入 main
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
