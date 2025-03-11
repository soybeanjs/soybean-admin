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

/** 检查文件是否存在 */
export const fetchCheckFile = (query: any) => {
  return request({
    url: '/pan/file/check/',
    method: 'post',
    data: query
  });
};

/** 上传文件夹 */
export const fetchUploadFolder = (data: any) => {
  return request({
    url: '/pan/folder',
    method: 'post',
    data
  });
};
