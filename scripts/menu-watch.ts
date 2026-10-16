import type { Plugin } from 'vite-plus';
import { reportMenuSync, syncMenus } from './menu-sync';

/** `menu:watch`（文档 §5.3 的 P2 / M-13）—— dev 期页面文件变更时自动跑 `pnpm menu:sync` 详见 docs/v3-notes.md N-394。 */
export function menuSyncWatch(): Plugin {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let running = false;
  let rerun = false;

  async function run() {
    // 上一轮还没跑完又来了变更 → 记一笔，跑完立刻补一轮
    if (running) {
      rerun = true;
      return;
    }

    running = true;

    try {
      reportMenuSync(await syncMenus());
    } catch (error) {
      // dev 工具不该因为扫描失败就掀桌子：打印原因，等下次变更再试
      console.error('[menu:watch] 同步失败：', error instanceof Error ? error.message : error);
    } finally {
      running = false;

      if (rerun) {
        rerun = false;
        void run();
      }
    }
  }

  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(() => void run(), 300);
  }

  return {
    name: 'soybean-admin:menu-watch',
    apply: 'serve',
    configureServer(server) {
      const PAGES_DIR = '/src/pages/';

      server.watcher.on('add', file => {
        if (file.replace(/\\/g, '/').includes(PAGES_DIR)) schedule();
      });
      server.watcher.on('unlink', file => {
        if (file.replace(/\\/g, '/').includes(PAGES_DIR)) schedule();
      });
    }
  };
}
