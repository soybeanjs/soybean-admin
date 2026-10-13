import type { Plugin } from 'vite-plus';
import { reportMenuSync, syncMenus } from './menu-sync';

/**
 * `menu:watch`（文档 §5.3 的 P2 / M-13）—— dev 期页面文件变更时自动跑 `pnpm menu:sync`。
 *
 * 只监听 `src/pages/**` 的**新增 / 删除 / 重命名**（`add` / `unlink`），因为只有这三类
 * 会改变「有哪些页面」这个机器事实。`change` 不触发：改标题/图标是人的审美决定，
 * 工具本来就不该覆盖（脚本的「只写派生字段」规则），而且每次存盘都扫全量页面太浪费。
 *
 * **必须防抖**：编辑器保存一次可能触发多个事件（尤其重命名 = unlink + add），
 * 且 `syncMenus` 要跑 `scanPages` 全量扫描。300ms 合并成一次。
 *
 * **必须防自触发**：`syncMenus` 写回 `src/menus/menus.json`，它不在 `src/pages/**`
 * 下所以不会自己触发自己；但如果将来把菜单源挪进页面目录，这个 watcher 会成环。
 *
 * 不接 `ubean.config.ts` 的 `modules`：那条路只在 `ubean build` CLI 的
 * `prepareBuild` 里被 `resolveModules` 解析，`vp dev`（裸 Vite）走的是
 * `vite.config.ts` 的 plugins —— 实测 `modules: [...]` 在 `vp dev` 下**完全不执行**。
 */
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
