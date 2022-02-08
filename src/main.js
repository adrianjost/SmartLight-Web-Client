import { createApp } from "vue";
import "./registerServiceWorker";
import Emitter from "tiny-emitter";

import App from "./App.vue";
import router from "./router";
import store from "./store";

const app = createApp(App);
app.config.globalProperties.$eventHub = new Emitter(); // Global event bus

app.use(router);
app.use(store);

import pkg from "../package.json";
import { init as initSentry } from "@sentry/vue";
import { BrowserTracing } from "@sentry/tracing";

if (process.env.VUE_APP_SENTRY_DSN) {
	initSentry({
		app,
		dsn: process.env.VUE_APP_SENTRY_DSN,
		environment: process.env.NODE_ENV,
		release: pkg.version,
		integrations: [
			new BrowserTracing({
				tracingOrigins: ["localhost", "app.smart-light.ga"],
			}),
		],
		tracesSampleRate: 1.0,
		logErrors: true,
	});
}

import Toasted from "vue-toasted";
const toastedInstance = Toasted.install({
	// options are set in patch-file
});

// eslint-disable-next-line vue/component-definition-name-casing
app.component("toasted", toastedInstance.component);
app.config.globalProperties.$toasted = toastedInstance.global;

import Ripple from "vue-ripple-directive";
app.directive("ripple", Ripple);

import toast from "@/mixins/toast.js";
app.mixin(toast);

app.mount("#app");
export default app;
