import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import firebase from 'firebase'
import router from './router'
import {config} from './helpers/firebaseConfig'

Vue.use(VueRouter);

new Vue({
  router,
  created() {
    firebase.initializeApp(config);
  },
  el: '#app',
  render: h => h(App)
});
