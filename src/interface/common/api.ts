/** 数据字典 */
export interface ResponseDictionary {
  /** 字典名字 */
  modelName: string;
  /** 要素名字(一级指标) */
  modelCharactorName: string;
  /** 要素下的指标key(二级指标) */
  modelIndicator: string;
  /** 要素下的指标名字(二级指标) */
  modelIndicatorName: string;
  /** 备注 */
  remarks: string;
  /** 指标公式 */
  formula: string;
}
