import type { AddReq, CreateCrudOptionsRet, DelReq, EditReq, UserPageQuery, UserPageRes } from '@fast-crud/fast-crud';
import { dict } from '@fast-crud/fast-crud';
import dayjs from 'dayjs';
import * as api from './api';

export default function createCrudOptions(): CreateCrudOptionsRet {
  const pageRequest = async (query: UserPageQuery): Promise<UserPageRes> => {
    return api.GetList(query);
  };
  const editRequest = async (ctx: EditReq) => {
    const { form, row } = ctx;
    form.id = row.id;
    return api.UpdateObj(form);
  };
  const delRequest = async (ctx: DelReq) => {
    const { row } = ctx;
    return api.DelObj(row.id);
  };

  const addRequest = async (req: AddReq) => {
    const { form } = req;
    return api.AddObj(form);
  };
  return {
    crudOptions: {
      container: {
        is: 'fs-layout-card'
      },
      request: {
        pageRequest,
        addRequest,
        editRequest,
        delRequest
      },
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
        datetime: {
          title: '时间',
          type: 'datetime',
          // naive 默认仅支持数字类型时间戳作为日期输入与输出
          // 字符串类型的时间需要转换格式
          valueBuilder(context) {
            const { value, row, key } = context;
            if (value) {
              // naive 默认仅支持时间戳作为日期输入与输出
              row[key] = dayjs(value).valueOf();
            }
          },
          valueResolve(context) {
            const { value, form, key } = context;
            if (value) {
              form[key] = dayjs(value).format('YYYY-MM-DD HH:mm:ss');
            }
          }
        },
        select: {
          title: '状态',
          search: { show: true },
          type: 'dict-select',
          dict: dict({
            url: '/mock/crud/demo/dict'
          })
        },
        text: {
          title: '文本',
          type: 'text',
          search: { show: true }
        },
        copyable: {
          title: '可复制',
          type: ['text', 'copyable'],
          search: { show: true }
        },
        avatar: {
          title: '头像裁剪',
          type: 'cropper-uploader'
        },
        upload: {
          title: '文件上传',
          type: 'file-uploader'
        },
        richtext: {
          title: '富文本',
          type: 'editor-wang5',
          column: {
            // cell中不显示
            show: false
          },
          form: {
            col: {
              // 横跨两列
              span: 24
            },
            component: {
              style: {
                height: '300px'
              }
            }
          }
        }
      }
    }
  };
}
