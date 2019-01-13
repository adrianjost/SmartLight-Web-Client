import Vue from 'vue'
import VueRouter from 'vue-router';

import store from './store'

Vue.use(VueRouter)

function loadView(path){
	return () => import(/* webpackChunkName: "view-[request]" */ `${path}`)
}

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
	routes: [
		{ path: '/login', component: loadView('./pages/Login.vue') , meta: { isPublic: true }},

		{ path: '/control', component: loadView('./pages/Control/index.vue') },
		{ path: '/control/:id', component: loadView('./pages/Control/id.vue') },

		{ path: '/settings', component: loadView('./pages/Settings/index.vue') },
		{ path: '/settings/add/:type', component: loadView('./pages/Settings/id.vue') },
		{ path: '/settings/edit/:id', component: loadView('./pages/Settings/id.vue') },

		{ path: '/*', redirect: '/control' },
	]
});

router.beforeEach((to, from, next) => {
	const isAuthenticated = store.getters["user/isAuthenticated"];
	if (!isAuthenticated && to.matched.some(record => !record.meta.isPublic)) {
		return next({
			path: '/login',
			query: {
				redirect: to.fullPath,
			},
		});
	}

	return next();
})

export default router;
