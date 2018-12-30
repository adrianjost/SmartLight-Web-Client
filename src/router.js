import VueRouter from 'vue-router';

import Login from './pages/Login.vue';
import ControlOverview from './pages/Control/index.vue';
import Control from './pages/Control/id.vue';
import Settings from './pages/Settings/index.vue';

import store from './store'

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/login', component: Login, meta: { isPublic: true }},
    { path: '/control/:id', component: Control },
    { path: '/control', component: ControlOverview },
    { path: '/settings/:id', component: Settings },
    { path: '/settings', component: Settings },
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
