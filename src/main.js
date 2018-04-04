import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import firebase from 'firebase'
import firebaseui from 'firebaseui';
import router from './router'
import {config} from './helpers/firebaseConfig'
import VModal from 'vue-js-modal'

Vue.use(VueRouter)
Vue.use(VModal, {
  width: "200px",
  height: "600px"
})

new Vue({
  router,
  created() {
    firebase.initializeApp(config);
  },
  el: '#app',
  render: h => h(App)
});
