/**
 * 有几种方式 第一种： 直接使用spark-md5 直接计算MD5(不好，会占用主线程) 第二种： 使用Web Worker 计算MD5(不好，需要自己处理进度) 第三种： 使用VueUse的Web Worker
 * 计算MD5(好，但是需要自己处理进度) 第四种： 使用hash-wasm 计算MD5(好，但是需要自己处理进度) URL: https://juejin.cn/post/7340636105765437492
 */
// import { useWebWorkerFn } from '@vueuse/core';

// type WorkerParams = { file: File; chunkSize: number };
// type WorkerResult = { hash?: string; error?: string };

// 定义一个可序列化的函数
// const computedMd5InWorker = async (params: WorkerParams): Promise<WorkerResult> => {
//   try {
//     const { file, chunkSize } = params;
//     const md5 = await createMD5();
//     md5.init();

//     const totalChunks = Math.ceil(file.size / chunkSize);

//     for (let i = 0; i < totalChunks; i += 1) {
//       const start = i * chunkSize;
//       const end = Math.min(start + chunkSize, file.size);
//       const chunk = file.slice(start, end);
//       // eslint-disable-next-line no-await-in-loop
//       const buffer = await chunk.arrayBuffer();
//       md5.update(new Uint8Array(buffer));
//     }

//     return { hash: md5.digest() };
//   } catch (errot) {
//     return { error: (errot as Error).message };
//   }
// };

// export const useFileHasher = () => {
//   // 使用 VueUse 的 Web Worker 封装
//   const { workerFn } = useWebWorkerFn(
//     async (params: WorkerParams): Promise<WorkerResult> => {
//       try {
//         const { file, chunkSize } = params;
//       } catch (errot) {
//         return { error: (errot as Error).message };
//       }
//     },
//     {
//       timeout: 50000,
//       dependencies: ['https://cdn.jsdelivr.net/npm/hash-wasm@4.12.0/dist/md5.umd.min.js']
//     }
//   );

//   // 带进度反馈的计算方法
//   const computedMD5 = async (file: File, chunkSize = 4 * 1024 * 1024) => {
//     if (!file) return { error: 'No file provided' };
//     // 调用 Web Worker 计算
//     try {
//       return await workerFn({ file, chunkSize });
//     } catch (error) {
//       return { error: (error as Error).message };
//     }
//   };

//   return {
//     computedMD5
//   };
// };
