declare module 'vue-simple-uploader' {
  import type { Plugin } from 'vue';
  const VueSimpleUploader: Plugin;
  export default VueSimpleUploader;
  export interface Uploader {
    /** 文件列表 */
    fileList: File[];
  }
}
