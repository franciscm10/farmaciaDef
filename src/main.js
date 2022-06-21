import Vue from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";

Vue.config.productionTip = false
Vue.use(PrimeVue, { ripple: true });
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

import Menubar from 'primevue/menubar';
Vue.component('Menubar', Menubar);
