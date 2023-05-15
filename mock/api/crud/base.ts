// eslint-disable-next-line max-params
function copyList(originList: any, newList: any, options: any, parentId?: number) {
  for (const item of originList) {
    const newItem = { ...item, parentId };
    newItem.id = options.idGenerator;
    options.idGenerator += 1;
    newList.push(newItem);
    if (item.children) {
      newItem.children = [];
      copyList(item.children, newItem.children, options, newItem.id);
    }
  }
}

function delById(req: any, list: any[]) {
  for (let i = 0; i < list.length; i += 1) {
    const item = list[i];
    if (item.id === parseInt(req.params.id, 10)) {
      list.splice(i, 1);
      break;
    }
    if (item.children && item.children.length > 0) {
      delById(req, item.children);
    }
  }
}

function findById(id: number, list: any[]): any {
  for (const item of list) {
    if (item.id === id) {
      return item;
    }
    if (item.children && item.children.length > 0) {
      const sub = findById(id, item.children);
      if (sub !== null && sub !== undefined) {
        return sub;
      }
    }
  }
  return null;
}
export default {
  buildMock(options: { name: string; copyTimes: number; list: any[]; idGenerator: number }) {
    const name = options.name;
    if (!options.copyTimes) {
      options.copyTimes = 29;
    }
    const list: any[] = [];
    for (let i = 0; i < options.copyTimes; i += 1) {
      copyList(options.list, list, options);
    }
    options.list = list;
    return [
      {
        path: `/mock/${name}/page`,
        method: 'post',
        handle(req: any) {
          let data = [...list];
          let limit = 20;
          let offset = 0;
          for (const item of list) {
            if (item.children && item.children.length === 0) {
              item.hasChildren = false;
              item.lazy = false;
            }
          }
          let orderAsc: any;
          let orderProp: any;
          if (req && req.body) {
            const { page, query, sort } = req.body;
            if (page.limit) {
              limit = parseInt(page.limit, 10);
            }
            if (page.offset) {
              offset = parseInt(page.offset, 10);
            }
            orderProp = sort.prop;
            orderAsc = sort.asc;

            if (Object.keys(query).length > 0) {
              // eslint-disable-next-line complexity
              data = list.filter(item => {
                let allFound = true; // 是否所有条件都符合
                // eslint-disable-next-line guard-for-in
                for (const key in query) {
                  // 判定某一个条件
                  const value = query[key];
                  if (value === undefined || value === null || value === '') {
                    // eslint-disable-next-line no-continue
                    continue;
                  }
                  if (value instanceof Array) {
                    // 如果条件中的value是数组的话，只要查到一个就行
                    if (value.length === 0) {
                      // eslint-disable-next-line no-continue
                      continue;
                    }
                    let found = false;
                    for (const i of value) {
                      if (item[key] instanceof Array) {
                        // eslint-disable-next-line max-depth
                        for (const j of item[key]) {
                          // eslint-disable-next-line max-depth
                          if (i === j) {
                            found = true;
                            break;
                          }
                        }
                        // eslint-disable-next-line max-depth
                        if (found) {
                          break;
                        }
                      } else if (item[key] === i || (typeof item[key] === 'string' && item[key].indexOf(`${i}`) >= 0)) {
                        found = true;
                        break;
                      }
                      if (found) {
                        break;
                      }
                    }
                    if (!found) {
                      allFound = false;
                    }
                  } else if (value instanceof Object) {
                    // eslint-disable-next-line max-depth,guard-for-in
                    for (const key2 in value) {
                      const v = value[key2];
                      if (v && item[key] && v !== item[key][key2]) {
                        return false;
                      }
                    }
                  } else if (item[key] !== value) {
                    allFound = false;
                  }
                }
                return allFound;
              });
            }
          }

          const start = offset;
          let end = offset + limit;
          if (data.length < end) {
            end = data.length;
          }

          if (orderProp) {
            // 排序
            data.sort((a, b) => {
              let ret = 0;
              if (a[orderProp] > b[orderProp]) {
                ret = 1;
              } else {
                ret = -1;
              }
              return orderAsc ? ret : -ret;
            });
          }

          const records = data.slice(start, end);
          const lastOffset = data.length - (data.length % limit);
          if (offset > lastOffset) {
            offset = lastOffset;
          }
          return {
            code: 200,
            message: 'success',
            data: {
              records,
              total: data.length,
              limit,
              offset
            }
          };
        }
      },
      {
        path: `/mock/${name}/get`,
        method: 'get',
        handle(req: any) {
          let id = req.params.id;
          id = parseInt(id, 10);
          let current = null;
          for (const item of list) {
            if (item.id === id) {
              current = item;
              break;
            }
          }
          return {
            code: 200,
            message: 'success',
            data: current
          };
        }
      },
      {
        path: `/mock/${name}/add`,
        method: 'post',
        handle(req: any) {
          req.body.id = options.idGenerator;
          options.idGenerator += 1;
          list.unshift(req.body);
          return {
            code: 200,
            message: 'success',
            data: req.body.id
          };
        }
      },
      {
        path: `/mock/${name}/update`,
        method: 'post',
        handle(req: any) {
          const item = findById(req.body.id, list);
          if (item) {
            Object.assign(item, req.body);
          }
          return {
            code: 200,
            message: 'success',
            data: null
          };
        }
      },
      {
        path: `/mock/${name}/delete`,
        method: 'post',
        handle(req: any) {
          delById(req, list);
          return {
            code: 200,
            message: 'success',
            data: null
          };
        }
      },
      {
        path: `/mock/${name}/batchDelete`,
        method: 'post',
        handle(req: any) {
          const ids = req.body.ids;
          for (let i = list.length - 1; i >= 0; i -= 1) {
            const item = list[i];
            if (ids.indexOf(item.id) >= 0) {
              list.splice(i, 1);
            }
          }
          return {
            code: 200,
            message: 'success',
            data: null
          };
        }
      },
      {
        path: `/mock/${name}/all`,
        method: 'post',
        handle() {
          return {
            code: 200,
            message: 'success',
            data: list
          };
        }
      }
    ];
  }
};
