import Vue from "vue";
import "./registerServiceWorker";
import Emitter from "tiny-emitter";

Vue.config.productionTip = false;

Vue.prototype.$eventHub = new Emitter(); // Global event bus

import pkg from "../package.json";
import * as Sentry from "@sentry/browser";
import * as Integrations from "@sentry/integrations";
if (process.env.VUE_APP_SENTRY_DSN) {
	Sentry.init({
		dsn: process.env.VUE_APP_SENTRY_DSN,
		environment: process.env.NODE_ENV,
		release: pkg.version,
		integrations: [
			new Integrations.Vue({ Vue, attachProps: true }),
			/*
			new Integrations.CaptureConsole({
				levels: ["warn", "error", "debug", "assert"],
			}),
			*/
		],
	});
}

import Toasted from "vue-toasted";
Vue.use(Toasted, {
	duration: 5000,
	position: "bottom-right",
	fullWidth: false,
});

import VueRouter from "vue-router";
Vue.use(VueRouter);

import Ripple from "vue-ripple-directive";
Vue.directive("ripple", Ripple);

import toast from "@/mixins/toast.js";
Vue.mixin(toast);

import App from "./App.vue";
import router from "./router";
import store from "./store";
export default new Vue({
	router,
	store,
	render: (h) => h(App),
}).$mount("#app");
