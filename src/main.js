import Vue from 'vue'
import App from './App.vue'

//import PortalVue from 'portal-vue'
//Vue.use(PortalVue);

import VueRouter from 'vue-router'
import router from './router'
Vue.use(VueRouter);

import Ripple from 'vue-ripple-directive'
Vue.directive('ripple', Ripple);

import store from './store'

const vm = new Vue({
  router,
  el: '#app',
  store,
  render: h => h(App)
});

export default vm
