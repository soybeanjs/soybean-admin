declare namespace Api {
  namespace Union {
    /**
     * 是否 Yes or No
     *
     * - "Y": yes
     * - "N": no
     */
    type YesOrNo = 'Y' | 'N';

    /**
     * 启用状态 Enable status
     *
     * - "1": 启用
     * - "2": 禁用
     */
    type EnableStatus = '1' | '2';

    /**
     * 菜单类型
     *
     * - "directory": 目录
     * - "menu": 菜单
     * - "iframe": iframe 页面（iframe 嵌入页面）
     * - "link": 链接（跳转外部链接）
     * - "page": 页面（不展示在菜单中，可用于作为菜单类型的子菜单展示在面包屑中）
     * - "other": 其他（作用自行定义）
     */
    type MenuType = 'page' | 'directory' | 'menu' | 'iframe' | 'link' | 'other';
  }
}
