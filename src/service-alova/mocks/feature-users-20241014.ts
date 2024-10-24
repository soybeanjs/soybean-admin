import { defineMock } from '@sa/alova/mock';

// you can separate the mock data into multiple files dependent on your project versions
export default defineMock({
  '[POST]/systemManage/addUser': () => {
    return {
      code: '0000',
      msg: 'success',
      data: null
    };
  },
  '[POST]/systemManage/updateUser': () => {
    return {
      code: '0000',
      msg: 'success',
      data: null
    };
  },
  '[DELETE]/systemManage/deleteUser': () => {
    return {
      code: '0000',
      msg: 'success',
      data: null
    };
  },
  '[DELETE]/systemManage/batchDeleteUser': () => {
    return {
      code: '0000',
      msg: 'success',
      data: null
    };
  },
  '[POST]/auth/sendCaptcha': () => {
    return {
      code: '0000',
      msg: 'success',
      data: null
    };
  },
  '[POST]/auth/verifyCaptcha': () => {
    return {
      code: '0000',
      msg: 'success',
      data: null
    };
  },
  '/mock/getLastTime': () => {
    return {
      code: '0000',
      msg: 'success',
      data: {
        time: new Date().toLocaleTimeString()
      }
    };
  }
});
