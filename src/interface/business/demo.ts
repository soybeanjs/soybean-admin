/** 数据字典 */
export interface Dictionary {
  /** 字典名字 */
  label: string;
  /** 要素名字(一级指标) */
  charactorLabel: string;
  /** 要素下的指标key(二级指标) */
  indicatorKey: string;
  /** 要素下的指标名字(二级指标) */
  indicatorLabel: string;
  /** 备注 */
  remark: string;
  /** 指标公式 */
  formula: string;
}
