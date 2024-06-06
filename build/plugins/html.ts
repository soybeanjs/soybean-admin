import type { Plugin } from 'vite';

export function setupHtmlPlugin(buildTime: string) {
  const plugin: Plugin = {
    name: 'html-plugin',
    apply: 'build',
    transformIndexHtml(html) {
      return html.replace('<head>', `<head>\n    <meta name="buildTime" content="${buildTime}">`);
    }
  };

  return plugin;
}
