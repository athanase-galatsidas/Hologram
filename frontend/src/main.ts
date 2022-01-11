import { createApp } from 'vue';

import App from '@/App.vue';
import '@/assets/screen.css'; // Import the css-file.
import router from '@/bootstrap/router';

const app = createApp(App);

app.use(router);

app.mount('#app');
