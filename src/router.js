import { createRouter, createWebHistory } from "vue-router";
import store from "./store";

function loadView(path) {
	return () => import(/* webpackChunkName: "view-[request]" */ `${path}`);
}

const router = createRouter({
	history: createWebHistory(),
	base: process.env.BASE_URL,
	routes: [
		{
			path: "/login",
			component: loadView("./pages/Login.vue"),
			meta: { isPublic: true },
		},

		{ path: "/control", component: loadView("./pages/Control/index.vue") },
		{ path: "/control/:id", component: loadView("./pages/Control/id.vue") },

		{ path: "/settings", component: loadView("./pages/Settings/index.vue") },
		{
			path: "/settings/add/:type",
			component: loadView("./pages/Settings/id.vue"),
		},
		{
			path: "/settings/edit/:id",
			component: loadView("./pages/Settings/id.vue"),
		},

		{ path: "/settings/api", component: loadView("./pages/Settings/api.vue") },

		{ path: "/:pathMatch(.*)*", redirect: "/control" },
	],
});

router.beforeEach(async (to, from, next) => {
	// await new Promise((resolve) => { // TODO use vueuse/core `until` utility
	// 	const interval = setInterval(() => {
	// 		if(store.getters["auth/initialized"]){
	// 			clearInterval(interval);
	// 			resolve();
	// 		}
	// 	}, 100);
	// })
	const isAuthenticated = store.getters["auth/isAuthenticated"];
	if (!isAuthenticated && to.matched.some((record) => !record.meta.isPublic)) {
		return next({
			path: "/login",
			query: {
				redirect: to.fullPath,
			},
		});
	} else if (
		isAuthenticated &&
		to.matched.some((record) => record.path === "/login")
	) {
		return next({ path: "/" });
	}
	return next();
});

export default router;
