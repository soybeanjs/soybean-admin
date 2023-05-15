import type { CreateCrudOptionsRet } from '@fast-crud/fast-crud';
import { dict } from '@fast-crud/fast-crud';
import * as api from './api';

export default function createCrudOptions(): CreateCrudOptionsRet {
  const pageRequest = async (query: any) => {
    return api.GetList(query);
  };
  const editRequest = async (ctx: { form: any; row: any }) => {
    const { form, row } = ctx;
    form.id = row.id;
    return api.UpdateObj(form);
  };
  const delRequest = async (ctx: { row: any }) => {
    const { row } = ctx;
    return api.DelObj(row.id);
  };

  const addRequest = async (ctx: { form: any }) => {
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
                  search: { show: true },
                  type: 'dict-select',
                  dict: dict({
                    data: [
                      { value: '广东省', label: '广东省' },
                      { value: '浙江省', label: '浙江省' }
                    ]
                  })
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
