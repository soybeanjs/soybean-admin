import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import {
  applyRemoveI18nPlan,
  collectSourceFiles,
  flattenMessages,
  inlineLabelFields,
  inlineTitleKeyMaps,
  inlineTranslations,
  interpolate,
  parseParamNames,
  planRemoveI18n,
  scanLeftovers,
  stripUnusedI18nHarness,
  toLiteral,
  unwrapLabelCalls
} from '../scripts/remove-i18n';

/**
 * `remove-i18n` 裁剪脚本的守卫。
 *
 * 脚本是**一次性大范围改写**（13 个文件 + 删 4 个路径），改坏了 `pnpm typecheck`
 * 才报错 —— 而那时工作区已经脏了。这里把纯函数与「计划」钉死：dry-run 的输出
 * 必须等于 `--write` 的结果（两者共用 `planRemoveI18n`），且在本仓库上跑
 * 必须 0 残留、0 待确认。
 */

const messages = {
  flat: flattenMessages({ common: { logout: '退出登录', language: '语言' }, login: { codeLogin: '验证码登录' } })
};

describe('remove-i18n：文案字面量生成', () => {
  it('toLiteral 按需降级：单引号 → 双引号 → 模板字面量', () => {
    expect(toLiteral('退出登录')).toBe("'退出登录'");
    expect(toLiteral("It's")).toBe('"It\'s"');
    expect(toLiteral('带"双引号"')).toBe('\'带"双引号"\'');
    expect(toLiteral('两行\n文案')).toBe('`两行\n文案`');
    expect(toLiteral('反引号 ` 与 ${x}')).toBe('`反引号 \\` 与 \\${x}`');
  });

  it('参数名解析与插值', () => {
    expect(parseParamNames('{ name, count }')).toEqual(['name', 'count']);
    expect(parseParamNames('{}')).toEqual([]);

    expect(interpolate('共 {count} 条', ['count'])).toBe('共 ${count} 条');
    expect(interpolate('无参数', [])).toBe('无参数');
    // 缺参数 → null（调用方记为 problem，不静默生成坏文案）
    expect(interpolate('共 {count} 条', [])).toBeNull();
  });
});

describe('remove-i18n：内联与结构改写', () => {
  it('内联字面量 t() / $t()，带参数也转成模板字符串', () => {
    const source = [
      "const a = t('common.logout');",
      'const b = $t("common.language", { count: n });',
      'const c = t(`dyn.${x}`);'
    ].join('\n');
    const result = inlineTranslations(source, messages);

    expect(result.code).toContain("'退出登录'");
    expect(result.code).toContain("'语言'");
    expect(result.inlined).toHaveLength(2);
    // 动态 key 不动，留给人工
    expect(result.code).toContain('t(`dyn.${x}`)');
  });

  it('文案表里没有的 key 记为 problem，不猜', () => {
    const result = inlineTranslations("t('common.missing')", messages);

    expect(result.problems).toHaveLength(1);
    expect(result.problems[0]).toContain('common.missing');
    expect(result.code).toContain("t('common.missing')");
  });

  it('标题 key 表 → 文案表，并把 t(activeTitleKey) 解包', () => {
    const source = [
      'const moduleTitleKeys: Record<LoginModule, string> = {',
      "  'pwd-login': 'common.logout',",
      "  'code-login': 'login.codeLogin'",
      '};',
      'const activeTitleKey = computed(() => moduleTitleKeys[activeModule.value]);',
      '<h1>{{ t(activeTitleKey) }}</h1>'
    ].join('\n');
    const result = inlineTitleKeyMaps(source, messages);

    expect(result.code).toContain('const moduleTitles: Record<LoginModule, string> = {');
    expect(result.code).toContain("'退出登录'");
    expect(result.code).toContain("'验证码登录'");
    expect(result.code).toContain('const activeTitle = computed(() => moduleTitles[activeModule.value]);');
    expect(result.code).toContain('{{ activeTitle }}');
    expect(scanLeftovers(result.code)).toEqual([]);
  });

  it('常量表 label 字段 → 文案，只认文案表里有的 key', () => {
    const source = [
      'const TABS = [',
      "  { value: 'pwd-login', label: 'common.logout' },",
      "  { value: 'code-login', label: 'login.codeLogin' },",
      "  { value: 'other', label: 'not.in.messages' }",
      '];',
      "const raw = 'common.logout';",
      'const item = { i18nKey: "login.codeLogin", label: "原文" };'
    ].join('\n');
    const result = inlineLabelFields(source, messages);

    expect(result.code).toContain("label: '退出登录'");
    expect(result.code).toContain("label: '验证码登录'");
    // 文案表里没有的 key: 原样留着（不会把未知 key 猜成文案）
    expect(result.code).toContain("label: 'not.in.messages'");
    // 非 label 字段（i18nKey / 普通字符串）不动：它们是数据
    expect(result.code).toContain('i18nKey: "login.codeLogin"');
    expect(result.code).toContain("const raw = 'common.logout';");
    expect(result.inlined).toEqual(['common.logout', 'login.codeLogin']);
  });

  it('解包 t(x.label)，但不动 t(i18nKey) 与带参/带函数的调用', () => {
    const source = [
      '<span>{{ t(preset.label) }}</span>',
      '<span>{{ $t(item.label) }}</span>',
      'const tabItems = computed(() => TABS.map(item => ({ value: item.value, label: t(item.label) })));',
      'const label = item.i18nKey ? t(item.i18nKey) : item.label;',
      'const kept = t(label);'
    ].join('\n');
    const result = unwrapLabelCalls(source);

    expect(result.code).toContain('{{ preset.label }}');
    expect(result.code).toContain('{{ item.label }}');
    expect(result.code).toContain('label: item.label }))');
    // 动态 key 与「t 包已翻译变量」不是本规则的事
    expect(result.code).toContain('item.i18nKey ? t(item.i18nKey) : item.label');
    expect(result.code).toContain('const kept = t(label);');
    expect(result.rewrites).toHaveLength(3);
  });

  it('useI18n 装配只在文件里已无 t() 时才清掉', () => {
    const clean = ["import { useI18n } from 'vue-i18n';", 'const { t } = useI18n();', 'const a = "退出登录";'].join(
      '\n'
    );
    const dirty = ["import { useI18n } from 'vue-i18n';", 'const { t } = useI18n();', 'const a = t("k");'].join('\n');

    expect(stripUnusedI18nHarness(clean).code).not.toContain('useI18n');
    expect(stripUnusedI18nHarness(dirty).code).toContain('useI18n');
  });
});

describe('remove-i18n：文件收集与残留扫描', () => {
  it('扫 src 下的 .vue / .ts，跳过测试与 locales 目录', () => {
    const files = collectSourceFiles(process.cwd());

    expect(files).toContain('src/app.ts');
    expect(files).toContain('src/pages/index.vue');
    expect(files.some(file => file.includes('src/locales/'))).toBe(false);
    expect(files.some(file => file.endsWith('.test.ts'))).toBe(false);
    expect(files.some(file => file.startsWith('scripts/'))).toBe(false);
  });

  it('注释里的 t() 不算残留，动态 t() 与 useI18n 装配算', () => {
    expect(scanLeftovers('// const label = t(m.key)')).toEqual([]);
    expect(scanLeftovers('/* 标题单一来源：t(i18nKey) */\nconst i18nKey = "menus";')).toEqual([]);

    const dynamic = scanLeftovers('const a = t(meta.i18nKey);');

    expect(dynamic).toHaveLength(1);
    expect(dynamic[0]?.label).toBe('动态 t(...)');

    expect(scanLeftovers("import { useI18n } from 'vue-i18n';").map(finding => finding.label)).toEqual(['useI18n']);
  });
});

describe('remove-i18n：本仓库计划（dry-run 不落盘）', () => {
  it('0 残留、0 待确认，且关键文件都在计划里', () => {
    const plan = planRemoveI18n(process.cwd(), messagesOk());

    expect(plan.leftovers).toEqual([]);
    expect(plan.problems).toEqual([]);

    for (const file of [
      'ubean.config.ts',
      'src/app.ts',
      'src/app.vue',
      'src/layouts/default.vue',
      'src/pages/(builtin)/login.vue'
    ]) {
      expect(plan.files.has(file), file).toBe(true);
    }

    expect(plan.deleted).toContain('src/locales');
    expect(plan.deleted).toContain('src/shared/vean-locale.ts');
    expect(plan.inlined).toBeGreaterThan(50);

    // 计划阶段绝不写盘
    expect(existsSync(join(process.cwd(), 'src/locales/zh.json'))).toBe(true);
  });
});

const fixtureRoots: string[] = [];

afterAll(() => {
  for (const root of fixtureRoots) rmSync(root, { recursive: true, force: true });
});

describe('remove-i18n：沙箱落盘', () => {
  it('applyRemoveI18nPlan 写改动文件并删除基础设施', () => {
    const root = mkdtempSync(join(tmpdir(), 'remove-i18n-'));

    fixtureRoots.push(root);
    mkdirSync(join(root, 'src/locales'), { recursive: true });
    mkdirSync(join(root, 'src/shared'), { recursive: true });
    mkdirSync(join(root, 'src/constants'), { recursive: true });
    writeFileSync(join(root, 'src/constants/index.ts'), "export const DEFAULT_LOCALE = 'zh';\n");
    writeFileSync(join(root, 'src/locales/zh.json'), JSON.stringify({ common: { logout: '退出登录' } }));
    writeFileSync(join(root, 'src/shared/i18n.ts'), 'export const RTL_LANGUAGE_SUBTAGS = [];\n');
    writeFileSync(
      join(root, 'src/demo.vue'),
      [
        '<script setup lang="ts">',
        "import { useI18n } from 'vue-i18n';",
        'const { t } = useI18n();',
        '</script>',
        '<template><p>{{ t("common.logout") }}</p></template>',
        ''
      ].join('\n')
    );

    const plan = planRemoveI18n(root, { flat: flattenMessages({ common: { logout: '退出登录' } }) });

    expect(plan.leftovers).toEqual([]);
    // 落盘前：文件还在
    expect(existsSync(join(root, 'src/locales/zh.json'))).toBe(true);

    applyRemoveI18nPlan(root, plan);

    expect(readFileSync(join(root, 'src/demo.vue'), 'utf8')).toContain("'退出登录'");
    expect(readFileSync(join(root, 'src/demo.vue'), 'utf8')).not.toContain('useI18n');
    expect(existsSync(join(root, 'src/locales'))).toBe(false);
    expect(existsSync(join(root, 'src/shared/i18n.ts'))).toBe(false);
  });
});

/** 真实文案表（从本仓库 `src/locales/zh.json` 读，与脚本同一来源） */
function messagesOk() {
  return { flat: flattenMessages(JSON.parse(readFileSync(join(process.cwd(), 'src/locales/zh.json'), 'utf8'))) };
}
