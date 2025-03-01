import { request } from '../request';

/** 网盘上传地址 */
export const simpleUploadURL = `${import.meta.env.VITE_SERVICE_BASE_URL}/pan/upload`;
/** 获取首页文件列表 */
export const fetchGetFileList = () => {
  return request({
    url: '/pan/filelist'
  });
};

/** 删除文件 */
export const fetchDeleteFile = (id: string) => {
  return request({
    url: `/pan/file/${id}`,
    method: 'delete'
  });
};
