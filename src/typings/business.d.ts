/** 用户相关模块 */
declare namespace Auth {
  /**
   * 用户角色类型(前端静态路由用角色类型进行路由权限的控制)
   * - super: 超级管理员(该权限具有所有路由数据)
   * - admin: 管理员
   * - test: 测试
   * - normal: 普通用户
   */
  type RoleType = 'super' | 'admin' | 'test' | 'normal';

  /** 用户信息 */
  interface UserInfo {
    /** 用户id */
    userId: string;
    /** 用户名 */
    userName: string;
    /** 用户手机号 */
    userPhone: string;
    /** 用户角色类型 */
    userRole: RoleType;
  }
}
