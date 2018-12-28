import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import router from './router'
import PortalVue from 'portal-vue'
import store from './store'

Vue.use(VueRouter);
Vue.use(PortalVue);

import 'normalize.css';

new Vue({
  router,
  el: '#app',
  store,
  render: h => h(App)
});
