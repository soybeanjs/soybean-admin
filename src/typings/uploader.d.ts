declare module 'vue-simple-uploader' {
  import type { Plugin } from 'vue';
  const VueSimpleUploader: Plugin;
  export default VueSimpleUploader;
  export interface Uploader {
    /** 文件列表 */
    fileList: File[];
    /** 文件路径 */
    filePaths: { [key: string]: UploadFile };
    /** 上传选项 */
    opts: any;
    /** 上传器退出 */
    cancel: () => void;
    /** 上传暂停 */
    resume: () => void;
  }

  type UploaderOptions = {
    /** 上传地址 */
    target: string;
    /** 上传方法 */
    uploadMethod?: string;
    /** 上传参数 */
    query?: { [key: string]: any };
  };

  export interface UploadFile {
    /** 文件ID */
    id: number;
    /** 文件名称 */
    name: string;
    /** 真实的文件 */
    file: File;
    /** 文件路径 */
    relativePath: string;
    /** 文件大小 */
    size: number;
    path: string;
    /** 父节点信息 */
    parent: UploadFile;
  }
}
