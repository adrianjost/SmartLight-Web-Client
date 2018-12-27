import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import firebase from 'firebase'
import VueFire from 'vuefire'
import router from './router'
import PortalVue from 'portal-vue'
import store from './store'

Vue.use(VueFire);
Vue.use(VueRouter);
Vue.use(PortalVue);

new Vue({
  router,
  el: '#app',
  store,
  render: h => h(App)
});
