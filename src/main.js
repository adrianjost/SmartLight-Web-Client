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
import { CaptureConsole as CaptureConsoleIntegration } from "@sentry/integrations";

if (process.env.VUE_APP_SENTRY_DSN) {
	initSentry({
		app,
		dsn: process.env.VUE_APP_SENTRY_DSN,
		environment: process.env.NODE_ENV,
		release: pkg.version,
		integrations: [
			new BrowserTracing({
				tracingOrigins: ["localhost", "app.smartlight.hackedit.de"],
			}),
			new CaptureConsoleIntegration({
				levels: ["warn", "error", "debug", "assert"],
			}),
		],
		tracesSampleRate: 1.0,
		logErrors: true,
	});
}

import Toasted from "vue-toasted";
Toasted.install(app, {
	// options are set in patch-file
	position: "bottom-right",
	duration: 5000,
});

import Ripple from "vue-ripple-directive";
app.directive("ripple", Ripple);

import toast from "@/mixins/toast.js";
app.mixin(toast);

app.mount("#app");
export default app;
