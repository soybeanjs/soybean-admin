import { type App } from 'vue';
import GoCaptcha, { Button, Click, Rotate, Slide, SlideRegion } from 'go-captcha-vue';

export function setupCaptcha(app: App) {
  app.use(GoCaptcha);

  app.component('GoCaptchaClick', Click);
  app.component('GoCaptchaButton', Button);
  app.component('GoCaptchaSlide', Slide);
  app.component('GoCaptchaSlideRegion', SlideRegion);
  app.component('GoCaptchaRotate', Rotate);
}
