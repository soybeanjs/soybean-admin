export function transformObjectToOption<T extends object>(obj: T) {
  return Object.entries(obj).map(([value, label]) => ({
    value,
    label
  })) as Common.OptionWithKey<keyof T>[];
}

/**
 * 基于远程数据对象转换为select options
 * @param obj 数据
 * @param valueKey 值对应的字段名
 * @param labelKey 标签对应的字段名
 */
export function transformDataToOption<T extends object>(obj: T, valueKey: string, labelKey: string) {
	return Object.entries(obj).map(item => {
		return {
			label: item[1][labelKey],
			value: item[1][valueKey]
		};
	}) as Common.OptionWithKey<keyof T>[];
}
