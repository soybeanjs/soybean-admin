import type { MethodType, MockMethod } from 'vite-plugin-mock';
import type { BaseMockOptions } from '../base';
import mockBase from '../base';
import MockOption = Service.MockOption;

const options: BaseMockOptions = {
  name: 'crud/header-group',
  idGenerator: 0,
  list: [
    {
      name: '张三',
      age: 18,
      province: '广东省',
      city: '深圳市',
      county: '南山区',
      street: '粤海街道'
    },
    {
      name: '李四',
      age: 26,
      province: '浙江省',
      city: '杭州市',
      county: '西湖区',
      street: '西湖街道'
    },
    {
      name: '王五',
      age: 24
    }
  ]
};
const mockedApis = mockBase.buildMock(options);

const apis: MockMethod[] = [];

for (const mockedApi of mockedApis) {
  apis.push({
    url: mockedApi.path,
    method: mockedApi.method as MethodType,
    response: (request: MockOption) => {
      return mockedApi.handle(request);
    }
  });
}

export default apis;
