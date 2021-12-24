/* eslint-disable no-console */

/** 打印log */
export function consoleLog(message?: any, ...optionalParams: any[]) {
  console.log(message, ...optionalParams);
}

/** 打印警告 */
export function consoleWarn(message?: any, ...optionalParams: any[]) {
  console.warn(message, ...optionalParams);
}

/** 打印错误 */
export function consoleError(message?: any, ...optionalParams: any[]) {
  console.error(message, ...optionalParams);
}
