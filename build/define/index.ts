import dayjs from 'dayjs';

/** 项目构建时间 */
const PROJECT_BUILD_TIME = JSON.stringify(dayjs().format('YYYY-MM-DD HH:mm:ss'));

export const define = {
  PROJECT_BUILD_TIME
};
