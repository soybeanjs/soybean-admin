import { EnumDataType } from '@/enum';

export function isNumber(data: any) {
  return Object.prototype.toString.call(data) === EnumDataType.number;
}
export function isString(data: any) {
  return Object.prototype.toString.call(data) === EnumDataType.string;
}
export function isBoolean(data: any) {
  return Object.prototype.toString.call(data) === EnumDataType.boolean;
}
export function isNull(data: any) {
  return Object.prototype.toString.call(data) === EnumDataType.null;
}
export function isUndefined(data: any) {
  return Object.prototype.toString.call(data) === EnumDataType.undefined;
}
export function isObject(data: any) {
  return Object.prototype.toString.call(data) === EnumDataType.object;
}
export function isArray(data: any) {
  return Object.prototype.toString.call(data) === EnumDataType.array;
}
export function isDate(data: any) {
  return Object.prototype.toString.call(data) === EnumDataType.date;
}
export function isRegExp(data: any) {
  return Object.prototype.toString.call(data) === EnumDataType.regexp;
}
export function isSet(data: any) {
  return Object.prototype.toString.call(data) === EnumDataType.set;
}
export function isMap(data: any) {
  return Object.prototype.toString.call(data) === EnumDataType.map;
}
