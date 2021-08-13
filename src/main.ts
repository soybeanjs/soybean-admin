import { createApp } from 'vue';
import App from './App.vue';
import { setupSmoothScroll, setupElementPlus } from './plugins';
import 'virtual:windi.css';
import './styles/css/global.css';

const app = createApp(App);
setupSmoothScroll();
setupElementPlus(app);

app.mount('#app');
