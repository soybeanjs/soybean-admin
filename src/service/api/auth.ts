import { mockRequest } from '../request';
import { userRoutesMiddleware } from '../middleware';

/**
 * 获取用户路由数据
 * @param userId - 用户id
 * @description 后端根据用户id查询到对应的角色类型，并将路由筛选出对应角色的路由数据返回前端
 */
export async function fetchUserRoutes(userId: string = 'soybean') {
  const { data } = await mockRequest<ApiRoute.ResponseRoute>(
    { url: '/getUserRoutes', method: 'post', data: { userId } },
    false
  );
  return userRoutesMiddleware(data);
}
