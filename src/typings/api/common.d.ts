/**
 * Namespace Api
 *
 * All backend api type
 */
declare namespace Api {
  namespace Common {
    interface CreatedUpdatedDTO {
      /** 创建人 */
      createdBy: string;
      /** 创建时间 */
      createdTime: string;
      /** 更新人 */
      updatedBy: string;
      /** 更新时间 */
      updatedTime: string;
    }

    interface CommonRecordDTO extends CreatedUpdatedDTO {
      /** 主键 */
      id: number;
      /**
       * 启用状态 Enable status
       *
       * - "1": 启用
       * - "2": 禁用
       */
      status: Union.EnableStatus | null;
    }

    interface PaginationQueryDTO {
      page: number;
      pageSize: number;
      sort: string;
    }

    interface PaginationDTO extends Pick<PaginationQueryDTO, 'page' | 'pageSize'> {
      /** 总条数 */
      total: number;
    }
  }
}
