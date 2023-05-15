import type { MethodType, MockMethod } from 'vite-plugin-mock';
import mockBase from '../base';

const options: any = {
  name: 'crud/demo',
  idGenerator: 0
};
const list: any[] = [
  {
    select: '1',
    text: '文本测试',
    copyable: '文本可复制',
    avatar: 'http://greper.handsfree.work/extends/avatar.jpg',
    richtext: '富文本',
    datetime: '2023-01-30 11:11:11'
  },
  {
    select: '2'
  },
  {
    select: '0'
  }
];
options.list = list;
const mockedApis = mockBase.buildMock(options);

const apis: MockMethod[] = [
  {
    url: `/mock/${options.name}/dict`,
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: '',
        data: [
          { value: '0', label: '关', color: 'warning' },
          { value: '1', label: '开', color: 'success' },
          { value: '2', label: '停' }
        ]
      };
    }
  }
];

for (const mockedApi of mockedApis) {
  apis.push({
    url: mockedApi.path,
    method: mockedApi.method as MethodType,
    response: (request: any) => {
      return mockedApi.handle(request);
    }
  });
}

export default apis;
