/**
 * Namespace Api
 *
 * All backend api type
 */
declare namespace Api {
  namespace Common {
    /** common params of paginating */
    interface PaginatingCommonParams {
      /** current page number */
      current: number;
      /** page size */
      size: number;
      /** total count */
      total: number;
    }

    /** common params of paginating query list data */
    interface PaginatingQueryRecord<T = any> extends PaginatingCommonParams {
      records: T[];
    }

    /** common search params of table */
    type CommonSearchParams = Pick<Common.PaginatingCommonParams, 'current' | 'size'> &
      CommonType.RecordNullable<{
        orderByColumn: string;
        isAsc: 'asc' | 'desc';
        params: { [key: string]: any };
      }>;

    /**
     * enable status
     *
     * - "1": enabled
     * - "2": disabled
     */
    type EnableStatus = '1' | '2';

    /**
     * 是否状态
     *
     * - "Y": 是
     * - "N": 否
     */
    type YesOrNoStatus = 'Y' | 'N';

    /** common record */
    type CommonRecord<T = any> = {
      /** record id */
      id: number;
      /** record creator */
      createBy: string;
      /** record create time */
      createTime: string;
      /** record updater */
      updateBy: string;
      /** record update time */
      updateTime: string;
      /** record status */
      status: EnableStatus | null;
    } & T;

    /** common tree record */
    type CommonTreeRecord = {
      /** record id */
      id: CommonType.IdType;
      /** record parent id */
      parentId: CommonType.IdType;
      /** record label */
      label: string;
      /** record weight */
      weight: number;
      /** record children */
      children: CommonTreeRecord[];
    }[];
  }
}
