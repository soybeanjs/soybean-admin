import NProgress from 'nprogress'; // 顶部进度条
import '../styles/css/nprogress.css';

NProgress.configure({
  easing: 'ease',
  speed: 500,
  trickleSpeed: 200,
  showSpinner: false
});
export default NProgress;
