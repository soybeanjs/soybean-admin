import { describe, expect, it } from 'vitest';
import { resolveExternalUrl, resolveIframeUrl } from '@/shared/iframe';

/**
 * 外链 / 内嵌页地址解析（P3-07）。
 * `resolveExternalUrl` 是 `link`（新窗口）与 `iframe`（内嵌）共同的数据入口，也是唯一挡下 `javascript:` 注入面的地方。
 */
describe('resolveExternalUrl', () => {
  it('放行 http / https 并返回规范化地址', () => {
    expect(resolveExternalUrl('https://example.com')).toBe('https://example.com/');
    expect(resolveExternalUrl('http://example.com/a?b=1')).toBe('http://example.com/a?b=1');
  });

  it('拒绝脚本 / 数据 / 文件协议', () => {
    expect(resolveExternalUrl('javascript:alert(1)')).toBe('');
    expect(resolveExternalUrl('data:text/html,<h1>x</h1>')).toBe('');
    expect(resolveExternalUrl('blob:https://example.com/uuid')).toBe('');
    expect(resolveExternalUrl('file:///etc/passwd')).toBe('');
  });

  it('拒绝相对路径（不是外链语义）', () => {
    expect(resolveExternalUrl('/manage/user')).toBe('');
    expect(resolveExternalUrl('./x')).toBe('');
    expect(resolveExternalUrl('example.com')).toBe('');
  });

  it('拒绝空值与非法字符串', () => {
    expect(resolveExternalUrl('')).toBe('');
    expect(resolveExternalUrl('   ')).toBe('');
    expect(resolveExternalUrl('http://')).toBe('');
  });

  it('拒绝非字符串输入（菜单字段可能为 null）', () => {
    expect(resolveExternalUrl(null)).toBe('');
    expect(resolveExternalUrl(undefined)).toBe('');
    expect(resolveExternalUrl(42)).toBe('');
  });
});

describe('resolveIframeUrl', () => {
  it('与 resolveExternalUrl 同一判定（内嵌页只比外链多一层渲染）', () => {
    expect(resolveIframeUrl('https://example.com/embed')).toBe('https://example.com/embed');

    expect(resolveIframeUrl('javascript:alert(1)')).toBe('');
  });
});
