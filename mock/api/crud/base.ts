export type ListItem = {
  id?: number;
  children?: ListItem[];
  [key: string]: any;
};
export type BaseMockOptions = { name: string; copyTimes?: number; list: ListItem[]; idGenerator: number };
type CopyListParams = { originList: ListItem[]; newList: ListItem[]; options: BaseMockOptions; parentId?: number };

function copyList(props: CopyListParams) {
  const { originList, newList, options, parentId } = props;
  for (const item of originList) {
    const newItem: ListItem = { ...item, parentId };
    newItem.id = options.idGenerator;
    options.idGenerator += 1;
    newList.push(newItem);
    if (item.children) {
      newItem.children = [];
      copyList({
        originList: item.children,
        newList: newItem.children,
        options,
        parentId: newItem.id
      });
    }
  }
}

function delById(req: Service.MockOption, list: any[]) {
  for (let i = 0; i < list.length; i += 1) {
    const item = list[i];
    if (item.id === parseInt(req.query.id, 10)) {
      list.splice(i, 1);
      break;
    }
    if (item.children && item.children.length > 0) {
      delById(req, item.children);
    }
  }
}

function findById(id: number, list: ListItem[]): any {
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

function matchWithArrayCondition(value: any[], item: ListItem, key: string) {
  if (value.length === 0) {
    return true;
  }
  let matched = false;
  for (const i of value) {
    if (item[key] instanceof Array) {
      for (const j of item[key]) {
        if (i === j) {
          matched = true;
          break;
        }
      }
      if (matched) {
        break;
      }
    } else if (item[key] === i || (typeof item[key] === 'string' && item[key].indexOf(`${i}`) >= 0)) {
      matched = true;
      break;
    }
    if (matched) {
      break;
    }
  }
  return matched;
}

function matchWithObjectCondition(value: any, item: ListItem, key: string) {
  let matched = true;
  for (const key2 of Object.keys(value)) {
    const v = value[key2];
    if (v && item[key] && v !== item[key][key2]) {
      matched = false;
      break;
    }
  }
  return matched;
}

function searchFromList(list: ListItem[], query: any) {
  const filter = (item: ListItem) => {
    let allFound = true; // 是否所有条件都符合
    for (const key of Object.keys(query)) {
      const value = query[key];
      if (value === undefined || value === null || value === '') {
        // no nothing
      } else if (value instanceof Array) {
        // 如果条件中的value是数组的话，只要查到一个就行
        const matched = matchWithArrayCondition(value, item, key);
        if (!matched) {
          allFound = false;
        }
      } else if (value instanceof Object) {
        // 如果条件中的value是对象的话，需要每个key都匹配
        const matched = matchWithObjectCondition(value, item, key);
        if (!matched) {
          allFound = false;
        }
      } else if (item[key] !== value) {
        allFound = false;
      }
    }
    return allFound;
  };
  return list.filter(filter);
}

export default {
  buildMock(options: BaseMockOptions) {
    const name = options.name;
    if (!options.copyTimes) {
      options.copyTimes = 29;
    }
    const list: any[] = [];
    for (let i = 0; i < options.copyTimes; i += 1) {
      copyList({
        originList: options.list,
        newList: list,
        options
      });
    }
    options.list = list;
    return [
      {
        path: `/mock/${name}/page`,
        method: 'post',
        handle(req: Service.MockOption) {
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
            const { page, query } = req.body;
            if (page.limit) {
              limit = parseInt(page.limit, 10);
            }
            if (page.offset) {
              offset = parseInt(page.offset, 10);
            }
            if (Object.keys(query).length > 0) {
              data = searchFromList(list, query);
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
              } else if (a[orderProp] < b[orderProp]) {
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
        handle(req: Service.MockOption) {
          let id = req.query.id;
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
        handle(req: Service.MockOption) {
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
        handle(req: Service.MockOption) {
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
        handle(req: Service.MockOption) {
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
        handle(req: Service.MockOption) {
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
