declare namespace Api {
  /**
   * namespace Auth
   *
   * backend api module: "auth"
   */
  namespace Auth {
    interface LoginToken {
      token: string;
      refreshToken: string;
    }

    interface UserInfo {
      userId: string;
      userName: string;
      nickName?: string;
      userEmail?: string;
      userPhone?: string;
      userGender?: string;
      deptName?: string;
      createTime?: string;
      userAvatar?: string;
      roles: string[];
      buttons: string[];
    }

    interface ClickCaptchaData {
      image: string;
      thumb: string;
      width?: number;
      height?: number;
    }

    interface ClickCaptchaBackendData extends ClickCaptchaData {
      captchaKey: string;
    }

    interface ClickCaptchaVerifyData {
      captchaToken: string;
      expiresIn: number;
    }

    interface LoginForm {
      userName: string;
      password: string;
      captchaToken?: string;
    }
  }
}
