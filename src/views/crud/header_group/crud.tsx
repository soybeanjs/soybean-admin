import type { CreateCrudOptionsRet, UserPageQuery, UserPageRes } from '@fast-crud/fast-crud';
import type { HeaderGroupRecord } from './api';
import * as api from './api';

export default function createCrudOptions(): CreateCrudOptionsRet {
  const pageRequest = async (query: UserPageQuery): Promise<UserPageRes> => {
    return api.GetList(query);
  };
  const editRequest = async (ctx: { form: HeaderGroupRecord; row: HeaderGroupRecord }) => {
    const { form, row } = ctx;
    form.id = row.id;
    return api.UpdateObj(form);
  };
  const delRequest = async (ctx: { row: HeaderGroupRecord }) => {
    const { row } = ctx;
    return api.DelObj(row.id);
  };

  const addRequest = async (ctx: { form: HeaderGroupRecord }) => {
    const { form } = ctx;
    return api.AddObj(form);
  };
  return {
    crudOptions: {
      container: {
        // is: 'fs-layout-card'
      },
      request: {
        pageRequest,
        addRequest,
        editRequest,
        delRequest
      },
      form: {
        layout: 'flex',
        labelWidth: '100px' // 表单label宽度
      },
      table: { size: 'small' },
      columns: {
        id: {
          title: 'ID',
          key: 'id',
          type: 'number',
          column: {
            width: 50
          },
          form: {
            show: false
          }
        },
        user: {
          title: '用户信息',
          children: {
            name: {
              title: '姓名',
              type: 'text'
            },
            age: {
              title: '年龄',
              type: 'number'
            }
          }
        },
        address: {
          title: '地址',
          children: {
            area: {
              title: '地区',
              children: {
                province: {
                  title: '省',
                  type: 'text',
                  search: { show: true }
                },
                city: {
                  title: '市',
                  search: { show: true },
                  type: 'text'
                },
                county: {
                  title: '区',
                  search: { show: true },
                  type: 'text'
                }
              }
            },
            street: {
              title: '街道',
              type: 'text'
            }
          }
        }
      }
    }
  };
}
