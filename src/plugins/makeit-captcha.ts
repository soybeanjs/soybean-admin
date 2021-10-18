import type { App } from 'vue';
import MakeitCaptcha from 'makeit-captcha';
import 'makeit-captcha/dist/captcha.min.css';

export default function setupMakeitCaptcha(app: App) {
  app.use(MakeitCaptcha);
}
