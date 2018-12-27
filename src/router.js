import VueRouter from 'vue-router';

import Login from './pages/Login.vue';
import Api from './pages/Api.vue';
import Control from './pages/Control.vue';
import Dashboard from './pages/Dashboard/index.vue';

import store from './store'

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/login', component: Login, meta: { isPublic: true }},
    { path: '/api', component: Api },
    { path: '/control/:id', component: Control },
    { path: '/*', component: Dashboard }
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
