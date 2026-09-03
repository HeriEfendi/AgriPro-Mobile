import { createApp } from 'vue';
import { IonicVue } from '@ionic/vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

/* Core Ionic CSS */
import '@ionic/vue/css/core.css';
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional Ionic Utilities CSS */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* App Theme & Utility CSS */
import '@/theme/variables.css';
import '@/style.css';

import { initSeedData } from '@/services/seedService';

const app = createApp(App);
const pinia = createPinia();

app.use(IonicVue, { animated: false });
app.use(pinia);
app.use(router);

// Initialize IndexedDB seed data (Offline knowledge & default profile)
initSeedData();

router.isReady().then(() => {
  app.mount('#app');
});
