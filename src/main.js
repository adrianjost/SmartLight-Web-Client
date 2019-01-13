import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'

Vue.config.productionTip = false

Vue.prototype.$eventHub = new Vue(); // Global event bus

import Toasted from 'vue-toasted';
Vue.use(Toasted, {
	duration: 5000,
	position: "bottom-left",
	"fullWidth": true,
})

import VueRouter from 'vue-router'
Vue.use(VueRouter);

import Ripple from 'vue-ripple-directive'
Vue.directive('ripple', Ripple);

import error from "@/mixins/error.js"
Vue.mixin(error);

export default new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app');
