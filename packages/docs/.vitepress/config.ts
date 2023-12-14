import process from 'node:process';
import path from 'node:path';
import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Soybean Admin',
  description: '一个优雅、清新、漂亮的中后台模版',
  head: [
    ['meta', { name: 'author', content: 'Soybean' }],
    [
      'meta',
      {
        name: 'keywords',
        content: 'soybean, soybean-admin, vite, vue, vue3, soybean-admin docs'
      }
    ],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    [
      'meta',
      {
        name: 'viewport',
        content: 'width=device-width,initial-scale=1,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no'
      }
    ],
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],
  srcDir: path.join(process.cwd(), 'packages/docs/src'),
  themeConfig: {
    logo: '/logo.svg',
    socialLinks: [{ icon: 'github', link: 'https://github.com/honghuangdc/soybean-admin' }],
    algolia: {
      appId: '98WN1RY04S',
      apiKey: '13e9f5767b774422a5880723d9c23265',
      indexName: 'soybean'
    },
    nav: [],
    sidebar: {}
  }
});
