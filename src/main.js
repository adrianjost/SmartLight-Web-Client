import Vue from 'vue'
import App from './App.vue'

Vue.prototype.$eventHub = new Vue(); // Global event bus

import Toasted from 'vue-toasted';
Vue.use(Toasted, {
	duration: 5000,
	position: "bottom-left",
	"fullWidth": true,
})

import VueRouter from 'vue-router'
import router from './router'
Vue.use(VueRouter);

import Ripple from 'vue-ripple-directive'
Vue.directive('ripple', Ripple);

import store from './store'
import error from "@/mixins/error.js"
Vue.mixin(error);

const vm = new Vue({
	router,
	el: '#app',
	store,
	render: h => h(App)
});

export default vm
