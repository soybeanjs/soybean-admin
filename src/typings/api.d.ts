/**
 * 命名空间 Api
 *
 * 所有后端 API 类型
 */
declare namespace Api {
  namespace Common {
    /** 分页通用参数 */
    interface PaginatingCommonParams {
      /** 当前页码 */
      current: number;
      /** 每页数量 */
      size: number;
      /** 总条数 */
      total: number;
    }

    /** 分页查询列表数据的通用参数 */
    interface PaginatingQueryRecord<T = any> extends PaginatingCommonParams {
      /** 数据列表 */
      records: T[];
    }

    /** 表格通用搜索参数 */
    type CommonSearchParams = Pick<Common.PaginatingCommonParams, 'current' | 'size'>;

    /**
     * 启用状态
     *
     * - "1": 启用
     * - "2": 禁用
     */
    type EnableStatus = '1' | '2';

    /** 通用记录 */
    type CommonRecord<T = any> = {
      /** 记录ID */
      id: number;
      /** 创建人 */
      createBy: string;
      /** 创建时间 */
      createTime: string;
      /** 更新人 */
      updateBy: string;
      /** 更新时间 */
      updateTime: string;
      /** 状态 */
      status: EnableStatus | null;
    } & T;
  }

  /**
   * 命名空间 Auth
   *
   * 后端 API 模块："auth"
   */
  namespace Auth {
    /** 登录令牌 */
    interface LoginToken {
      token: string;
      refreshToken: string;
    }

    /** 用户信息 */
    interface UserInfo {
      userId: string;
      userName: string;
      roles: string[];
      buttons: string[];
    }
  }

  /**
   * 命名空间 Route
   *
   * 后端 API 模块："route"
   */
  namespace Route {
    type ElegantConstRoute = import('@elegant-router/types').ElegantConstRoute;

    /** 菜单路由 */
    interface MenuRoute extends ElegantConstRoute {
      id: string;
    }

    /** 用户路由 */
    interface UserRoute {
      routes: MenuRoute[];
      home: import('@elegant-router/types').LastLevelRouteKey;
    }
  }
}
