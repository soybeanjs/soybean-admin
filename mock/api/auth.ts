import type { MockMethod } from 'vite-plugin-mock';

const token: ApiAuth.Token = {
  token: '__TEMP_TOKEN__',
  refreshToken: '__TEMP_REFRESH_TOKEN__'
};

const apis: MockMethod[] = [
  // 获取验证码
  {
    url: '/mock/getSmsCode',
    method: 'post',
    response: (): Service.MockServiceResult<boolean> => {
      return {
        code: 200,
        message: 'ok',
        data: true
      };
    }
  },
  // 密码登录
  {
    url: '/mock/loginByPwd',
    method: 'post',
    response: (): Service.MockServiceResult<ApiAuth.Token> => {
      return {
        code: 200,
        message: 'ok',
        data: token
      };
    }
  },
  // 验证码登录
  {
    url: '/mock/loginByCode',
    method: 'post',
    response: (): Service.MockServiceResult<ApiAuth.Token> => {
      return {
        code: 200,
        message: 'ok',
        data: token
      };
    }
  },
  // 获取用户信息(请求头携带token)
  {
    url: '/mock/getUserInfo',
    method: 'get',
    response: (): Service.MockServiceResult<ApiAuth.UserInfo> => {
      return {
        code: 200,
        message: 'ok',
        data: {
          userId: '0',
          userName: 'Soybean',
          userPhone: '15170283876',
          userRole: 'super'
        }
      };
    }
  },
  {
    url: '/mock/testToken',
    method: 'post',
    response: (option: any): Service.MockServiceResult<true | null> => {
      if (option.headers?.authorization !== token.token) {
        return {
          code: 66666,
          message: 'token 失效',
          data: null
        };
      }
      return {
        code: 200,
        message: 'ok',
        data: true
      };
    }
  },
  {
    url: '/mock/updateToken',
    method: 'post',
    response: (): Service.MockServiceResult<string> => {
      return {
        code: 200,
        message: 'ok',
        data: token.token
      };
    }
  }
];

export default apis;
