import type { ResponseDictionary, Dictionary } from '@/interface';

export function fecthDictionaryMiddleware(data: ResponseDictionary[]): Dictionary[] {
  return data.map(item => {
    const {
      modelName: label,
      modelCharactorName: charactorLabel,
      modelIndicator: indicatorKey,
      modelIndicatorName: indicatorLabel,
      remarks: remark,
      formula
    } = item;

    return {
      label,
      charactorLabel,
      indicatorKey,
      indicatorLabel,
      remark,
      formula
    };
  });
}
