import { createApp } from 'vue';
import App from './App.vue';
import { setupElementPlus } from './plugins';
import 'virtual:windi.css';

const app = createApp(App);
setupElementPlus(app);
app.mount('#app');
