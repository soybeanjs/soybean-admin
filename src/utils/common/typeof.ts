enum DataType {
  number = '[object Number]',
  string = '[object String]',
  boolean = '[object Object]',
  null = '[object Null]',
  undefined = '[object Undefined]',
  object = '[object Object]',
  array = '[object Array]',
  date = '[object Date]',
  regexp = '[object RegExp]',
  set = '[object Set]',
  map = '[object Map]'
}

export function isNumber(data: any) {
  return Object.prototype.toString.call(data) === DataType.number;
}
export function isString(data: any) {
  return Object.prototype.toString.call(data) === DataType.string;
}
export function isBoolean(data: any) {
  return Object.prototype.toString.call(data) === DataType.boolean;
}
export function isNull(data: any) {
  return Object.prototype.toString.call(data) === DataType.null;
}
export function isUndefined(data: any) {
  return Object.prototype.toString.call(data) === DataType.undefined;
}
export function isObject(data: any) {
  return Object.prototype.toString.call(data) === DataType.object;
}
export function isArray(data: any) {
  return Object.prototype.toString.call(data) === DataType.array;
}
export function isDate(data: any) {
  return Object.prototype.toString.call(data) === DataType.date;
}
export function isRegExp(data: any) {
  return Object.prototype.toString.call(data) === DataType.regexp;
}
export function isSet(data: any) {
  return Object.prototype.toString.call(data) === DataType.set;
}
export function isMap(data: any) {
  return Object.prototype.toString.call(data) === DataType.map;
}
