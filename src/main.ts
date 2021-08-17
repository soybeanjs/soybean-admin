import { createApp } from 'vue';
import App from './App.vue';
import { setupRouter } from './router';
import { setupSmoothScroll, setupElementPlus } from './plugins';
import 'virtual:windi.css';
import './styles/css/global.css';

const app = createApp(App);
setupSmoothScroll();
setupElementPlus(app);
setupRouter(app);

app.mount('#app');
