/** http请求头的content-type类型 */
export enum ContentType {
  json = 'application/json',
  formUrlencoded = 'application/x-www-form-urlencoded',
  formData = 'multipart/form-data'
}

/** 数据类型 */
export enum EnumDataType {
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
