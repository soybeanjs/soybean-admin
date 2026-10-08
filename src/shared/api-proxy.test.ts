import { describe, expect, it } from 'vitest';
import {
  API_PROXY_PREFIX,
  buildProxyRouteRules,
  parseApiProxyKeys,
  parseApiProxyTargets,
  resolveProxyBaseUrl,
  resolveProxyKey
} from './api-proxy';

/**
 * P2-18：多 baseURL 代理配置的守卫。
 *
 * 这个模块同时被 `ubean.config.ts`（Node 配置加载）、客户端请求层、集成测试
 * 引用，是最容易「一处手滑、全局 404」的地方 —— 非法配置必须被丢弃而不是
 * 生成一条把请求打进死循环的规则。
 */

describe('代理 key 解析', () => {
  it('解析 key=origin 列表并去掉尾斜杠、规整为 origin', () => {
    expect(parseApiProxyTargets('default=https://api.example.com/,admin=http://127.0.0.1:8080')).toEqual([
      { key: 'default', origin: 'https://api.example.com' },
      { key: 'admin', origin: 'http://127.0.0.1:8080' }
    ]);
  });

  it('丢弃非法条目：非 http(s)、带路径、缺 key、空 key 都不进配置', () => {
    const parsed = parseApiProxyTargets(
      'ok=http://a.test,ftp://b.test,bad=http://c.test/path,=http://d.test,no-separator,ok2='
    );

    expect(parsed).toEqual([{ key: 'ok', origin: 'http://a.test' }]);
  });

  it('同 key 后写覆盖先写（便于按环境追加覆盖），且不产生重复规则', () => {
    const parsed = parseApiProxyTargets('default=http://a.test,default=http://b.test');

    expect(parsed).toEqual([{ key: 'default', origin: 'http://b.test' }]);
  });

  it('客户端 key 列表去空白、去重、丢弃非法 key', () => {
    expect(parseApiProxyKeys('default, admin ,default,BAD,9ok')).toEqual(['default', 'admin', '9ok']);
    expect(parseApiProxyKeys('')).toEqual([]);
  });
});

describe('代理路由规则', () => {
  it('规则用 /** 后缀，转发出后缀原样接到上游 origin 后（保持 /api 前缀）', () => {
    const rules = buildProxyRouteRules([{ key: 'default', origin: 'https://api.example.com' }]);

    expect(rules).toEqual({ [`${API_PROXY_PREFIX}/default/**`]: { proxy: 'https://api.example.com/**' } });
  });

  it('目标写成 {origin}/** 而不是写死 /api/**，任意挂载前缀都成立', () => {
    const [rule] = Object.values(buildProxyRouteRules([{ key: 'k', origin: 'http://a.test' }]));

    expect(rule?.proxy).toBe('http://a.test/**');
  });

  it('空配置生成空规则集（不注册通配代理，避免把 / 也代理走）', () => {
    expect(buildProxyRouteRules([])).toEqual({});
  });
});

describe('客户端 baseURL', () => {
  it('合法 key 拼出 /_p/{key}，非法 key 返回空串（请求不带代理前缀）', () => {
    expect(resolveProxyBaseUrl('default')).toBe('/_p/default');
    expect(resolveProxyBaseUrl('Bad Key')).toBe('');
    expect(resolveProxyBaseUrl('')).toBe('');
  });

  it('反向解析 baseURL → key，非代理 baseURL 返回空串', () => {
    expect(resolveProxyKey('/_p/default')).toBe('default');
    expect(resolveProxyKey('/_p/default/api')).toBe('');
    expect(resolveProxyKey('https://api.example.com')).toBe('');
  });
});
