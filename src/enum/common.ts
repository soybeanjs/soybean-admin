/** http请求头的content-type类型 */
export enum EnumContentType {
  json = 'application/json',
  formUrlencoded = 'application/x-www-form-urlencoded',
  formData = 'multipart/form-data'
}

/** 数据类型 */
export enum EnumDataType {
  number = '[object Number]',
  string = '[object String]',
  boolean = '[object Boolean]',
  null = '[object Null]',
  undefined = '[object Undefined]',
  object = '[object Object]',
  array = '[object Array]',
  function = '[object Function]',
  date = '[object Date]',
  regexp = '[object RegExp]',
  promise = '[object Promise]',
  set = '[object Set]',
  map = '[object Map]',
  file = '[object File]'
}
