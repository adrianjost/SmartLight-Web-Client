import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import firebase from 'firebase'
import router from './router'
import {config} from './helpers/firebaseConfig'
import PortalVue from 'portal-vue'
import store from './store'

Vue.use(VueRouter);
Vue.use(PortalVue)

new Vue({
  router,
  created() {
    firebase.initializeApp(config);
  },
  el: '#app',
  store,
  render: h => h(App)
});
