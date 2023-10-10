import type { UserConfig } from '@farmfe/core';
import { loadEnv } from 'vite';
// import vue from '@farmfe/js-plugin-vue';
import postcss from '@farmfe/js-plugin-postcss';
import { createViteProxy, getRootPath, getSrcPath, setupVitePlugins, viteDefine } from './build';
import { getServiceEnvConfig } from './.env-config';

function defineConfig(config: UserConfig) {
  return config;
}

const mode = process.env.NODE_ENV as string;
const viteEnv = loadEnv(mode, process.cwd()) as unknown as ImportMetaEnv;

const rootPath = getRootPath();
const srcPath = getSrcPath();

const isOpenProxy = viteEnv.VITE_HTTP_PROXY === 'Y';
const envConfig = getServiceEnvConfig(viteEnv);

export default defineConfig({
  root: rootPath,
  compilation: {
    resolve: {
      alias: {
        '~': rootPath,
        '@': srcPath
        // 'socket.io-parser': 'socket.io-parser/build/esm',
        // 'engine.io-parser': 'engine.io-parser/build/esm'
      }
    },
    define: viteDefine,
    sourcemap: true
  },
  vitePlugins: setupVitePlugins(viteEnv) as object[],
  plugins: [['@farmfe/plugin-sass', { additionalData: `@use "@/styles/scss/global.scss" as *;` }], postcss()],
  server: {
    // host: '0.0.0.0',
    port: 3200,
    // open: true,
    proxy: createViteProxy(isOpenProxy, envConfig) as any
  }
});

//     css: {
//       preprocessorOptions: {
//         scss: {
//           additionalData: `@use "./src/styles/scss/global.scss" as *;`
//         }
//       }
//     },
//     server: {
//       host: '0.0.0.0',
//       port: 3200,
//       open: true,
//       proxy: createViteProxy(isOpenProxy, envConfig)
//     },
//     optimizeDeps: {
//       include: [
//         '@antv/data-set',
//         '@antv/g2',
//         '@better-scroll/core',
//         'echarts',
//         'swiper',
//         'swiper/vue',
//         'vditor',
//         'wangeditor',
//         'xgplayer'
//       ]
//     },
//     build: {
//       reportCompressedSize: false,
//       sourcemap: false,
//       commonjsOptions: {
//         ignoreTryCatch: false
//       }
//     }
//   };
// });
